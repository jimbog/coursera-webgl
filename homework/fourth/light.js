/**
 * Light
 */
(function(window) {
  'use strict';

  var Light = {

    initPosition: function(distance, type) {
      var w = (type === 'sunlight') ? 0.0 : 0.1;
      return vec4(1.0, 1.0, distance, w);
    },

    defaultSource: function(enabledFlag, initialTheta) {
      var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 ),
        lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialDiffuse =  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

      return {
        lightPosition: vec4(1.0, 1.0, 1.0, 0.0 ),
        lightAmbient: vec4( 1.0, 1.0, 1.0, 1.0 ),
        diffuseProduct: mult(lightDiffuse, materialDiffuse),
        specularProduct: mult(lightSpecular, materialSpecular),
        theta: initialTheta,
        enabled: enabledFlag
      };
    },

    // TODO fill this in
    globalAmbient: function() {

    },

    // TODO iterate lightSources and count how many have emabled=true
    numEnabled: function(lightSources) {

    },

    rotatePoint2D: function(theta, radius) {
      var thetaRad = radians(theta);
      var newX = radius * Math.cos(theta);
      var newY = radius * Math.sin(theta);
      return vec2(newX, newY);
    },

    rotatePoint3D: function(point, xAngle, yAngle) {
      var origX = point[0];
      var origY = point[1];
      var origZ = point[2];
      var xAngleRad = radians(xAngle);
      var yAngleRad = radians(yAngle);

      var newX = (Math.cos(yAngleRad) * origX) +
        (Math.sin(yAngleRad) * Math.sin(xAngleRad) * origY) -
        (Math.sin(yAngleRad) * Math.cos(xAngleRad) * origZ);

      var newY = (Math.cos(xAngleRad) * origY) +
        (Math.sin(xAngleRad) * origZ);

      var newZ = (Math.sin(yAngleRad) * origX) +
        (Math.cos(yAngleRad) * origY) +
        (Math.cos(yAngleRad) * Math.cos(xAngleRad) * origZ);

      return vec3(newX, newY, newZ);
    }

  };

  window.Light = Light;

})(window);
