const express = require('express');
const noteData = require('./db/db.json');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');