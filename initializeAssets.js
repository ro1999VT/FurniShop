function readTextFile(file, type)
{
  textOut = [];
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        var allText = rawFile.responseText;
        tempArr = allText.split('\r\n');
        if(type == 'moves')
        {
          for (let i = 0; i < tempArr.length; i++)
          {
            temp = tempArr[i].split(';');
            temp[0] = int(temp[0]);
            temp[2] = int(temp[2]);
            temp[3] = int(temp[3]);
            temp[4] = temp[4] == 'true';
            textOut.push(new Move(temp));
          }
        }
        else if(type == 'furnimon')
        {
          for (let i = 0; i < tempArr.length; i++)
          {
            temp = tempArr[i].split(';');
            temp[0] = int(temp[0]);
            temp[2] = int(temp[2]);
            temp[3] = int(temp[3]);
            temp[4] = temp[4] == 'true';
            textOut.push(new Move(temp));
          }
        }
      }
    }
  }
  rawFile.send(null);
  return textOut;
}

function initializeAssets()
{ 
  assets.insert('Background-Battle_1', loadImage('Assets/Images/Backgrounds/background6.png'));
  assets.insert('BattleGround-Ground_1', loadImage('Assets/Images/Ground/groundOne.png'));

  assets.insert('Icon-Info_1', loadImage('Assets/Images/Icons/infoIcon.png'));

  assets.insert('Icon-Box_1', loadImage('Assets/Images/Icons/boxIcon.png'));
  assets.insert('Icon-Attack_1', loadImage('Assets/Images/Icons/attackIcon.png'));
  assets.insert('Icon-Cart_1', loadImage('Assets/Images/Icons/cartIcon.png'));
  assets.insert('Icon-Run_1', loadImage('Assets/Images/Icons/runIcon.png'));
  
  assets.insert('Anim-Gang_1', loadImage('Assets/Images/Animations/gang.png'));
  assets.insert('Character-Player_1', loadImage('Assets/Images/Players/Character/trainer.png'));

  // id, name, damage, cost, isSpecial, affinity, description
  moveList = readTextFile('Assets/Data/Moves/moves.txt', 'moves')
  //print(moveList)
}
