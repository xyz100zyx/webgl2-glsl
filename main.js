(() => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const gl = canvas.getContext("webgl2");
  if (!gl) return;

  const program = gl.createProgram();

  // vertex shader
  const SOURCE_vertexShader = `#version 300 es
    
    in vec3 aColor;
    in float aPointSize;
    in vec2 aPosition;

    out vec3 vColor;

    void main(){
        vColor = aColor;
        gl_Position = vec4(aPosition,0.0,1.0);
        gl_PointSize = aPointSize;
    }
    `;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, SOURCE_vertexShader);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);

  // fragment shader
  const SOURCE_fragmentShader = `#version 300 es
    
precision mediump float;

    in vec3 vColor;
    out vec4 fragColor;

  void main(){
      fragColor = vec4(vColor,1.0);
  }
  `;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, SOURCE_fragmentShader);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
  }

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.log(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  const ATTRIBUTE_LOCATION_pointSize = gl.getAttribLocation(
    program,
    "aPointSize"
  );
  const ATTRIBUTE_LOCATION_position = gl.getAttribLocation(
    program,
    "aPosition"
  );
  const ATTRIBUTE_LOCATION_color = gl.getAttribLocation(program, "aColor");

  gl.enableVertexAttribArray(ATTRIBUTE_LOCATION_pointSize);
  gl.enableVertexAttribArray(ATTRIBUTE_LOCATION_position);
  gl.enableVertexAttribArray(ATTRIBUTE_LOCATION_color);

  // block of the buffer for pisitions
  /* 
    [
    0, 1, => first point position
    -1, -1, => second point position
    1, -1 => thrid point position
    ]
  */
  const positionBufferData = new Float32Array([0, 1, -1, -1, 1, -1]);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionBufferData, gl.STATIC_DRAW);

  // block of the buffer for point size
  /* 
    [
    100, => first point size
    32, => second point size
    50 => thrid point size
    ]
  */
  const pointSizeBufferData = new Float32Array([100, 32, 50]);
  const pointSizeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointSizeBufferData, gl.STATIC_DRAW);

  // block of the buffer for color
  /* 
    [
    1, 0, 0, => red
    0, 1, 0, => green
    0, 0, 1 => blue
    ]
  */
  const colorBufferData = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);

  // block: join the "positionBufferData" buffer data with attribute pointer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(ATTRIBUTE_LOCATION_position, 2, gl.FLOAT, false, 0, 0);

  // block: join the "pointSizeBuffer" buffer data with attribute pointer
  gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
  gl.vertexAttribPointer(
    ATTRIBUTE_LOCATION_pointSize,
    1,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(ATTRIBUTE_LOCATION_color, 3, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
})();
