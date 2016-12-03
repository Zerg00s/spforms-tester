var gulp = require('gulp')
var spforms = require('spforms');
var Cpass = require("cpass");
var cpass = new Cpass();

gulp.task('default', _ => {
    var pass = cpass.decode('33021b9cb7bba3418e86cbf3eb046068cdb401f262cdba70b4eba9bc848d66a74ef8e559f52392a08d010edd8d0b25b7efEh6rwbd5JoIvq0dH3YMg==');
    var spformsHelper = spforms({username:'dmolodtsov@jolera.com', password: pass});
    
    var webPartSettings = {
        siteUrl: 'https://jolera365.sharepoint.com/sites/senate/',
        listTitle: 'test_spforms',
        contentLink: ''
    };

    var promise = spformsHelper.getListFields(webPartSettings);

    promise.then(function(data){
        console.log(JSON.stringify(data, null, 2));
        //TODO: We have all Field data now. create Angular View based on it! 
        var copySettings = {
            destinationFolder: 'App', // project-relative folder for storing Forms
            listTitle: 'test_spforms',
            deploymentFolder: 'Assets' // web/relative folder for storing forms
        };

        spformsHelper.copyForms(copySettings, generatedHtmlPath=> {
            webPartSettings.contentLink = 'https://jolera365.sharepoint.com/sites/senate/Assets/' + generatedHtmlPath;
            spformsHelper.addCEWP2LitstForms(webPartSettings);
        });

    })

});

gulp.task('copy', _=>{
    var spformsHelper = spforms({username:'dmolodtsov@jolera.com', password: 'pass'});

    var copySettings = {
        destinationFolder: 'App',
        listTitle: 'TestList',
        deploymentFolder: 'Assets' // web/relative folder for storing forms
    };

    spformsHelper.copyForms(copySettings);
        
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