const redis = require("redis");
const { logger } = require("./logger.service");
class RedisService {
  constructor() {
    this.client = redis.createClient();
    this.connect();
  }

  async connect() {
    this.client.on("connect", () => {
      logger.log("Connected to Redis");
    });

    this.client.on("error", (err) => {
      logger.error("Redis error:", err);
    });

    await this.client.connect();
  }

  // CRUD operations for keys
  async setKey({ key, value, expirationInSeconds = null }) {
    try {
      if (expirationInSeconds) {
        await this.client.set(key, value, { ["EX"]: expirationInSeconds });
        logger.log(
          `Set key "${key}" with expiration of ${expirationInSeconds} seconds`
        );
      } else {
        await this.client.set(key, value);
        logger.log(`Set key "${key}" without expiration`);
      }
    } catch (err) {
      logger.error("Error setting key:", err);
      throw err;
    }
  }

  async getKey({ key }) {
    try {
      const value = await this.client.get(key);
      logger.log(`Retrieved key "${key}":`, value);
      return value;
    } catch (err) {
      logger.error("Error getting key:", err);
      throw err;
    }
  }

  async deleteKey({ key }) {
    try {
      await this.client.del(key);
      logger.log(`Deleted key "${key}"`);
    } catch (err) {
      logger.error("Error deleting key:", err);
      throw err;
    }
  }

  async updateKey({ key, value, expirationInSeconds = null }) {
    try {
      await this.setKey({ key, value, expirationInSeconds });
      logger.log(`Updated key "${key}"`);
    } catch (err) {
      logger.error("Error updating key:", err);
      throw err;
    }
  }

  // Set operations with metadata
  async addToSetWithMetadata({
    key,
    member,
    expirationInSeconds,
    retryCount = null,
  }) {
    try {
      const timestamp = Date.now() + expirationInSeconds * 1000;
      const memberKey =
        retryCount !== null
          ? `${member}|EXP|${timestamp}|RC|${retryCount}`
          : `${member}|EXP|${timestamp}`;
      await this.client.sAdd(key, memberKey);
      logger.log(
        `Added member "${memberKey}" to set "${key}" with 
        expiration in ${expirationInSeconds} seconds`
      );
    } catch (err) {
      logger.error("Error adding member with metadata:", err);
      throw err;
    }
  }

  async getValidMembers({ key }) {
    try {
      const members = await this.client.sMembers(key);
      const now = Date.now();

      const validMembers = members.filter((member) => {
        const [, , expTimestamp] = member.split("|EXP|");
        return parseInt(expTimestamp.split("|")[0], 10) > now;
      });

      logger.log(`Valid members of set "${key}":`, validMembers);
      return validMembers;
    } catch (err) {
      logger.error("Error retrieving valid members:", err);
      throw err;
    }
  }

  async removeExpiredMembers({ key }) {
    try {
      const members = await this.client.sMembers(key);
      const now = Date.now();

      const expiredMembers = members.filter((member) => {
        const [, , expTimestamp] = member.split("|EXP|");
        return parseInt(expTimestamp.split("|")[0], 10) <= now;
      });

      if (expiredMembers.length > 0) {
        await this.client.sRem(key, ...expiredMembers);
        logger.log(
          `Removed expired members from set "${key}":`,
          expiredMembers
        );
      } else {
        logger.log(`No expired members to remove from set "${key}"`);
      }
    } catch (err) {
      logger.error("Error removing expired members:", err);
      throw err;
    }
  }

  async updateRetryCount({ key, member }) {
    try {
      const members = await this.client.sMembers(key);

      const updatedMembers = members.map((redisKey) => {
        if (redisKey.startsWith(member)) {
          const parts = redisKey.split("|RC|");
          if (parts.length > 1) {
            const retryCount = parseInt(parts[1] || "0", 10) + 1;
            return `${parts[0]}|RC|${retryCount}`;
          }
          return `${redisKey}|RC|1`;
        }
        return redisKey;
      });

      await this.client.del(key);
      await this.client.sAdd(key, ...updatedMembers);

      logger.log(`Updated retry count for member "${member}" in set "${key}"`);
    } catch (err) {
      logger.error("Error updating retry count:", err);
      throw err;
    }
  }

  async filterMembersByKey({ key, filterKey }) {
    try {
      const members = await this.client.sMembers(key);

      const filteredMembers = members.filter((member) => {
        const memberKey = member.split("|EXP|")[0];
        return memberKey.includes(filterKey);
      });

      logger.log(
        `Filtered members from set "${key}" with filter "${filterKey}":`,
        filteredMembers
      );
      return filteredMembers;
    } catch (err) {
      logger.error("Error filtering members by key:", err);
      throw err;
    }
  }

  async disconnect() {
    try {
      await this.client.disconnect();
      logger.log("Disconnected from Redis");
    } catch (err) {
      logger.error("Error disconnecting from Redis:", err);
      throw err;
    }
  }
}

module.exports = new RedisService();
