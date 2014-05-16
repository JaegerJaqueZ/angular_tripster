'use strict';


angular.module('tripsterApp')


    // Angular File Upload module does not include this directive
    // Only for example


    /**
    * The ng-thumb directive
    * @author: nerv
    * @version: 0.1.2, 2014-01-09
    */
    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

				var fr = new FileReader;
				var exif;
				
				fr.onloadend = function() {

					exif = EXIF.readFromBinaryFile(new BinaryFile(this.result));
					
					// canvas
	                var canvas = element.find('canvas');
	                $( "canvas" ).addClass( "img-responsive" );

				    // MegaPixImage constructor accepts File/Blob object.
				    var mpImg = new MegaPixImage(params.file);
				    // Render resized image into canvas element.
				    mpImg.render(canvas[0], { maxHeight: 300, maxWidth: 500, orientation: exif.Orientation });
				};
				
				fr.readAsBinaryString(params.file);


                // var canvas = element.find('canvas');
                // $( "canvas" ).addClass( "img-responsive" );
                // var reader = new FileReader();
                // 
                // reader.onload = onLoadFile;
                // reader.readAsDataURL(params.file);
                // 
                // function onLoadFile(event) {
                //     var img = new Image();
                //     img.onload = onLoadImage;
                //     img.src = event.target.result;
                // }
                // 
                // function onLoadImage() {
                //     // var width = params.width || this.width / this.height * params.height;
                //     // var height = params.height || this.height / this.width * params.width;
                //     
                //     canvas.attr({ width: this.width, height: this.height });
                //     canvas[0].getContext('2d').drawImage(this, 0, 0, this.width, this.height);
                // }
            }
        };
    }]);
