"use strict";

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/Todo-app';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
exports.PORT = process.env.PORT || 3000;