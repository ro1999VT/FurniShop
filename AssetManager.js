
// Asset Manager Class: Used to make asset references 
// streamlined and easy to follow.
class AssetManager{
  constructor() // Asset manager constructor
  {
    this.assets = new Map(); // Map for storing assets
  }
  // Insert function for inserting asset into AssetManager
  insert(type, img = 0)
  {
    // If asset type not in manager, add new field to manager
    if (this.assets.get(type) == undefined)
      this.assets.set(type, []);
    let temp; // temp variable
    temp = this.assets.get(type); // Get asset array from map
    if (img == 0)
      temp.push(get(0,0,width,height)); // Push new asset to array
    else
      temp.push(img); // Push new asset to array
    this.assets.set(type, temp); // Reset array in map
  }
  // Display asset to screen at position (x,y) with size 'tileSize'
  display(type,x,y)
  {
    // If asset type not in manager, do nothing
    if (this.assets.get(type) == undefined)
      return;
    image(random(this.assets.get(type)), x, y, tileSize, tileSize); // Display asset at location
  }
  // Display asset to screen at position (x,y,tile1,tile2)
  display2(type,x,y,tile1,tile2)
  {
    // If asset type not in manager, do nothing
    if (this.assets.get(type) == undefined)
      return;
    // Display asset at location
    image(random(this.assets.get(type)), x, y, tile1, tile2);
  }

  displayBackgr(type, num = 0)
  {
    // If asset type not in manager, do nothing
    let temp = this.assets.get(type);
    if (temp == undefined)
      return;
    background(temp[num%temp.length]); // Display asset at location
  }
  
  get(type)
  {
    return random(this.assets.get(type));
  }
  
  getConst(type, num = 0)
  {
    let temp = this.assets.get(type);
    return temp[num%temp.length];
  }
}