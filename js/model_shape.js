var MODEL_SHAPE;
var IS_MODEL_SHAPE_LOADED = false;
var SHAPE_INDICES; 

initShape = async () => {
  MODEL_URL = './model/shape/tensorflowjs_model.pb';
  WEIGHTS_URL = './model/shape/weights_manifest.json';

  MODEL_SHAPE = await tf.loadFrozenModel(MODEL_URL, WEIGHTS_URL);
  console.log("Model Shape Loaded");

  SHAPE_INDICES = (await (await fetch('./js/indices.json') ).json() ).indices;

  MODEL_SHAPE.execute({Placeholder:tf.zeros([1, 256, 256, 3])});
  IS_MODEL_SHAPE_LOADED = true;
  M.toast({html: 'Model Shape Loaded.'})
};

initShape();

function predictShape(image){
  var normalized = tf.fromPixels(image, 3).toFloat().div(tf.scalar(255))

  var input = normalized.reshape([1, 256, 256, 3]);
  var points = MODEL_SHAPE.execute({Placeholder:input}).dataSync();
  var image_array = normalized.dataSync();

  var geometry = new THREE.Geometry();

  SHAPE_INDICES.forEach( function(i){
    x = points[i*3  ];
    y = points[i*3+1];
    z = points[i*3+2];
    int_x = Math.round(x*256*1.2);
    int_y = Math.round(y*256*1.2);
    if( 0 <= int_x && int_x < 256 && 0 <= int_y && int_y < 256 )
    {
        index = ( int_y * 256 + int_x ) * 3;
        r = image_array[index  ];
        g = image_array[index+1];
        b = image_array[index+2];
    }
    else
    {
        r = 0; g = 0; b = 0;
    }

    geometry.vertices.push(new THREE.Vector3(x-0.5,0.5-y,z-0.5));
    geometry.colors.push(new THREE.Color(r,g,b));
  });

  return geometry;
}
