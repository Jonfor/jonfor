/**
 * Created by Jonfor on 12/20/16.
 */
const fs = require('fs');
const Promise = require('bluebird');
const options = {
    // Initialization Options
    promiseLib: Promise
};
const pgp = require('pg-promise')(options);
const databaseName = 'jonfor';
const connectionString = 'jonfor://localhost:5432/' + databaseName;
const db = pgp(connectionString);

function getAllSounds(req, res, next) {
    db.any('SELECT * FROM sounds')
        .then(function (data) {
            const length = data.length;
            var currSound = 0;
            const soundNames = [];
            for (currSound; currSound < length; currSound++) {
                soundNames.push(data[currSound].original_file_name);
            }
            res.status(200)
                .json({
                    success: true,
                    data: soundNames,
                    message: 'Retrieved all sounds.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getSingleSound(req, res, next) {
    var soundId = parseInt(req.params.id);
    db.one('SELECT * FROM sounds WHERE id = $1', soundId)
        .then(function (data) {
            res.json({
                success: true,
                data: data.original_file_name
            });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createSound(req, res, next) {
    db.none('INSERT INTO sounds(file_name, original_file_name, data_type, description)' +
        'VALUES(${file_name}, ${original_file_name}, ${data_type}, ${description})', {
        file_name: req.file.filename,
        original_file_name: req.file.originalname,
        data_type: req.file.mimetype,
        description: req.body.description
    })
        .then(function () {
            res.status(200)
                .json({
                    success: true,
                    message: 'Inserted one sound.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateSound(req, res, next) {
    res.status(200)
        .json({
            success: true,
            message: 'Not implemented.'
        });
    // db.none('UPDATE sounds SET file_name=$1, data_type=$2, description=$3 where id=$4',
    //     [req.body.file_name, parseInt(req.body.data_type),
    //         req.body.description, parseInt(req.params.id)])
    //     .then(function () {
    //         res.status(200)
    //             .json({
    //                 success: true,
    //                 message: 'Updated sound.'
    //             });
    //     })
    //     .catch(function (err) {
    //         return next(err);
    //     });
}

function removeSound(req, res, next) {
    var soundId = parseInt(req.params.id);
    db.result('DELETE FROM sounds WHERE id = $1', soundId)
        .then(function (result) {
            res.status(200)
                .json({
                    success: true,
                    message: 'Removed' + result.rowCount + 'sound.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = {
    getAllSounds: getAllSounds,
    getSingleSound: getSingleSound,
    createSound: createSound,
    updateSound: updateSound,
    removeSound: removeSound
};