const Affinity = {
    General : 0
}

AffinityKeys = Object.keys(Affinity).reduce(function(acc, key) {
    return acc[Affinity[key]] = key, acc;
}, {});

getAffinity = function(ordinal) {
    return AffinityKeys[ordinal];
}

class Move
{
    constructor(id, name, damage, cost, isSpecial, affinity, description)
    {
        if(name===undefined)
        {
            this.id = id[0];
            this.name = id[1];
            this.damage = id[2];
            this.cost = id[3]
            this.isSpecial = id[4];
            this.affinity = id[5];
            this.description = id[6];
        }
        else
        {
            this.id = id;
            this.name = name;
            this.damage = damage;
            this.cost = cost;
            this.isSpecial = isSpecial;
            this.affinity = affinity;
            this.description = description;
        }
    }   
}


class Stats
{
    constructor(hp, weight, attack, special_attack, defense, special_defense, speed, accuracy)
    {
        this.hp = hp;
        this.weight = weight;
        this.attack = attack;
        this.special_attack = special_attack;
        this.defense = defense;
        this.special_defense = special_defense;
        this.speed = speed;
        this.accuracy = accuracy;
    }

    copy()
    {
        return new Stats(this.hp, this.weight, this.attack, this.special_attack, this.defense, this.special_defense, this.speed, this.accuracy);
    }
}


class Furnimon
{ 
    constructor(id, assets, name, nickname, level, size, stats, moves)
    {
        this.id = id;
        this.assets = assets;  // [front facing, back facing]

        this.name = name;
        this.nickname = nickname;

        this.level = level;
        this.weight = weight;
        this.size = size;  // [width, height]

        this.currentStats = stats;
        this.resetStats = stats.copy();

        this.moves = moves;    
    }

    draw(x,y,zoom=1,frontFacing = true, fadeVal = 255)
    {
        if(frontFacing)
            image(this.assets[0],x,y,this.size[0]*zoom,this.size[1]*zoom);
        else
            image(this.assets[1],x,y,this.size[0]*zoom,this.size[1]*zoom);
    }

} 