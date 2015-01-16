var obj = {};
obj.x ||= 2;
assert.equal(obj.x, 2);

obj = {};
assert.equal(obj.x ||= 2, 2);

obj = { x: 1 };
obj.x ||= 2;
assert.equal(obj.x, 1);

obj = { x: 1 };
assert.equal(obj.x ||= 2, 1);

obj = { x: undefined }
obj.x ||= 2;
assert.equal(obj.x, 2);

obj = { x: undefined }
assert.equal(obj.x ||= 2, 2);

obj = { x: null }
obj.x ||= 2;
assert.equal(obj.x, 2);

obj = { x: null }
assert.equal(obj.x ||= 2, 2);

obj = { x: false }
obj.x ||= 2;
assert.equal(obj.x, false);

obj = { x: false }
assert.equal(obj.x ||= 2, false);

obj = undefined;
obj ||= 2;
assert.equal(obj, 2);

obj = undefined;
assert.equal(obj ||= 2 , 2);

obj = 1;
obj ||= 2;
assert.equal(obj, 1);

obj = 1;
assert.equal(obj ||= 2 , 1);

obj = null;
obj ||= 2;
assert.equal(obj, 2);

obj = null;
assert.equal(obj ||= 2 , 2);

