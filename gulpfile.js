var gulp = require('gulp');
var sppull = require('sppull').sppull;
var spsave = require("gulp-spsave");
var watch = require("gulp-watch");
var prompt = require("gulp-prompt");
var config = require('./gulp.config');
var spforms = require('spforms');
var Cpass = require("cpass");
var cpass = new Cpass();
var prompt = require("gulp-prompt");
var fs = require('fs');
var path = require('path');
var urljoin = require('url-join');


var through = require('through2');
var LiveReload = require('sp-live-reload');


// Promts you to choose a task 
gulp.task('default', function() {
    var taskNames = [];
    for (var taskName in gulp.tasks) {
        if (gulp.tasks.hasOwnProperty(taskName)) {
            taskNames.push(taskName);
        }
    }

    return gulp.src('*').pipe(
        prompt.prompt({
            type: 'list',
            name: 'task',
            message: 'Choose task name',
            choices: taskNames
        }, function(userResponse){
            gulp.tasks[userResponse.task].fn();
        }));
});


gulp.task('generate',_=>{
    var pass = cpass.decode('33021b9cb7bba3418e86cbf3eb046068cdb401f262cdba70b4eba9bc848d66a74ef8e559f52392a08d010edd8d0b25b7efEh6rwbd5JoIvq0dH3YMg==');
    var spformsHelper = spforms({username:'dmolodtsov@jolera.com', password: pass});
    
    var listSettings = {
        siteUrl: 'https://jolera365.sharepoint.com/sites/senate/',
        listTitle: 'NewList',
        sourcePath: 'src', //root-relative path on the disk
        assetsUrl: 'Assets' //Assets folder Url
    };

    spformsHelper.generateAngularForm(listSettings);

});
 
 

//Get new secure string pass:
//Example of Use:
//gulp createPass --pass MySecrеtPass
gulp.task('createPass', function(){
    var Cpass = require("cpass");
    var cpass = new Cpass();
    var password = process.argv[4];
    var secured = cpass.encode(password);
    console.log(secured);
} );



gulp.task('touch-conf', function() {
    console.log("Checking configs...");
    gulp.src('')
        .pipe(prompt.prompt(config.prompts, function(res) {
            config = config.rebuildConfig(res, config);
        }));
});

gulp.task('sppull-all', ['touch-conf'], function(cb) {
    console.log("Pulling from SharePoint");
    sppull(config.sppull.context, config.sppull.options)
        .then(function() {
            cb();
        })
        .catch(function(err) {
            cb(err);
        });
});

gulp.task("watch-assets", ['touch-conf'], function () {
    console.log("Watch Assets");
    return watch(config.watch.assets, function (event) {
        console.log(event.path);
        gulp.src(event.path, {
            base: config.watch.base
        }).pipe(spsave(config.spsave.coreOptions, config.spsave.creds));
    }); 
});

gulp.task("publish", ['touch-conf'], function () {
    console.log("Publish Assets");
    return gulp.src(config.watch.assets, {
        base: config.watch.base
    }).pipe(spsave(config.spsave.coreOptions, config.spsave.creds));
});

gulp.task("watch-live", ['touch-conf'], function () {
    console.log("Watch with reload is initiated");
    var liveReload = new LiveReload(config.liveReload);
    liveReload.runServer();

    return watch(config.watch.assets, function (event) {
        console.log(event.path);
        gulp.src(event.path, {
            base: config.watch.base
        }).pipe(spsave(config.spsave.coreOptions, config.spsave.creds))
        .pipe(through.obj(function (chunk, enc, cb) {
            var chunkPath = chunk.path;
            liveReload.emitUpdatedPath(chunkPath);
            cb(null, chunk);
        }));
    });
});

gulp.task("live-reload-install", ['touch-conf'], function () {
    console.log("Installing live reload to site collection");
    var liveReload = new LiveReload(config.liveReload);
    liveReload.provisionMonitoringAction(function() {
        console.log("Custom action has been installed");
    }, function(err) {
        console.log(err.message);
    });
});

gulp.task("live-reload-unistall", ['touch-conf'], function () {
    console.log("Retracting live reload from site collection");
    var liveReload = new LiveReload(config.liveReload);
    liveReload.retractMonitoringAction(function() {
        console.log("Custom action has been retracted");
    }, function(err) {
        console.log(err.message);
    });
});