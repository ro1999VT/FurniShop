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
    constructor(id, name, damage, cost, affinity, description)
    {
        if(name===undefined)
        {
            this.id = id[0];
            this.name = id[1];
            this.damage = id[2];
            this.cost = id[3]
            this.affinity = id[4];
            this.description = id[5];
        }
        else
        {
            this.id = id;
            this.name = name;
            this.damage = damage;
            this.cost = cost;
            this.affinity = affinity;
            this.description = description;
        }
    }   

    // Calculate any special effects for any moves
    specialEffects(caster, affected)
    {
        if(this.id == 4)
        {
            caster.base.battleStats.hp -= round(caster.base.currentStats.hp*0.5)
            if (caster.base.battleStats.hp < 0)
                caster.base.battleStats.hp = 0;
        }
        if(this.id == 5)
            affected.base.battleStats.accuracy -= affected.base.currentStats.accuracy*0.1
        if(this.id == 6)
            affected.base.battleStats.accuracy -= affected.base.currentStats.accuracy*0.15
        if(this.id == 8)
        {
            caster.base.battleStats.hp -= round(caster.base.currentStats.hp*0.25)
            if (caster.base.battleStats.hp < 0)
                caster.base.battleStats.hp = 0;
        }
        if(this.id == 9)
        {
            caster.base.battleStats.attack += caster.base.currentStats.attack*0.25
        }
        if(this.id == 10)
        {
            caster.base.battleStats.hp += round(caster.base.currentStats.hp*0.5)
            if (caster.base.battleStats.hp > caster.base.currentStats.hp)
                caster.base.battleStats.hp = caster.base.currentStats.hp;
        }
        if(this.id == 11)
            caster.base.battleStats.accuracy = caster.base.currentStats.accuracy
    }
}


class Stats
{
    constructor(hp, attack, special_attack, defense, special_defense, speed, accuracy, energy, weight)
    {
        this.hp = hp;
        this.weight = weight;
        this.attack = attack;
        this.special_attack = special_attack;
        this.defense = defense;
        this.special_defense = special_defense;
        this.speed = speed;
        this.accuracy = accuracy;
        this.energy = energy;
    }

    copy()
    {
        return new Stats(this.hp, this.attack, this.special_attack, this.defense, this.special_defense, this.speed, this.accuracy, this.energy, this.weight);
    }

    levelScale(level, value, special=false)
    {
        if (!special)
            return floor(0.01*(2*value + 64*level + 5))
        return floor(0.01*(1 + (level/100))*value)
    }

    levelScaleAll(level, base)
    {
        this.hp = floor(this.levelScale(level, base.hp)) + level + 10
        this.attack = this.levelScale(level, base.attack)
        this.special_attack = this.levelScale(level, base.special_attack, true)
        this.defense = this.levelScale(level, base.defense)
        this.special_defense = this.levelScale(level, base.special_defense, true)
        this.speed = this.levelScale(level, base.speed)
    }
}

class BaseFurnimon
{
    constructor(id, name, stats, assets, experience, affinities, size)
    {
        this.id = id;
        this.assets = assets;  // [front facing, back facing]

        this.name = name;
        this.size = size;  // [width, height]
        this.affinities = affinities;
        this.experience = experience;

        // special (super) attack/defense not included in total calculation
        this.baseStatTotal = stats.hp + stats.attack + stats.defense + stats.speed;
        this.baseStats = stats.copy();
        this.currentStats = stats.copy();
        this.battleStats = stats.copy();
    }

    draw(x,y,zoom=1,frontFacing = true, fadeVal = 255)
    {
        if(frontFacing)
            image(this.assets[0],x,y,this.size[0]*zoom,this.size[1]*zoom);
        else
            image(this.assets[1],x,y,this.size[0]*zoom,this.size[1]*zoom);
    }

    copy()
    {
        return new BaseFurnimon(this.id, this.name, this.baseStats, this.assets, this.experience, this.affinities, this.size)
    }

    getValidMoveList()
    {
        let temp  = []
        this.affinities.push("General")
        for(let i = 0; i < moveList.length; i++)
        {
            for (let j = 0; j < this.affinities.length; j++)
            {
                //print(moveList[i].affinity, this.affinities[j], moveList[i].affinity == this.affinities[j])
                if(moveList[i].affinity == this.affinities[j] && moveList[i].id < 1000)
                    temp.push(i)
            }
        }
        this.affinities.pop()
        return temp
    }
}

class Furnimon
{ 
    constructor(baseFurnimon, level, moves, nickname=null)
    {
        this.base = baseFurnimon;
        this.nickname = nickname;
        this.level = level;
        this.moves = moves;   
        this.currentExp = 0;
        this.currentMaxExp = 0;
        this.setCurrentMaxExp();

        this.base.currentStats.levelScaleAll(this.level, this.base.baseStats)
        this.base.battleStats = this.base.currentStats.copy()
    }

    getName()
    {
        if (this.nickname == null)
            return this.base.name
        return this.nickname
    }

    getMove(index)
    {
        if(index >= 0 && index < this.moves.length)
            return this.moves[index]
        return moveList[0]
    }

    setCurrentMaxExp()
    {
        this.currentMaxExp =  this.base.experience*(1.015^this.level)
    }

    restoreStats()
    {
        this.base.battleStats = this.base.currentStats.copy()
    }

    calculateExpGain(enemyFurnimon, lose)
    {
        if(lose)
            this.currentExp += (1 + (enemyFurnimon.base.baseStatTotal/1000))*(1 + (enemyFurnimon.base.currentStats.defense/300))*enemyFurnimon.base.currentStats.hp*15/4;
        else
            this.currentExp += (1 + (enemyFurnimon.base.baseStatTotal/1000))*(1 + (enemyFurnimon.base.currentStats.defense/300))*enemyFurnimon.base.currentStats.hp*15;
        
        while (this.currentExp > this.currentMaxExp)
        {
            this.currentExp -= this.currentMaxExp;
            this.level += 1;
            this.setCurrentMaxExp();
            this.base.currentStats.levelScaleAll(this.level, this.base.baseStats)
        }
        if(this.currentExp < 0)
            this.currentExp = 0;
        this.restoreStats()
    }

    calculateDamage(enemyFurnimon, move, overwrite = true)
    {
        let thisStats = this.base.battleStats;
        let enemStats = enemyFurnimon.base.battleStats;

        // If Furnimon does not have enough energy to make move
        if(enemStats.energy < move.cost || move.id == 0)
            return 0;
        
        // Calculate damage multiplier based on speed difference
        let speedMult = thisStats.speed/enemStats.speed
        if (speedMult < 1)
            speedMult = 1;
        else
        {
            let temp = speedMult - floor(speedMult)
            if(random() < temp)
                temp = 1
            else
                temp = 0
            speedMult =  floor(speedMult) + temp
        }

        // Calculate same affinity attack multiplier
        let SAAM = 1
        for (let i = 0; i < this.base.affinities.length; i++)
        {
            if (this.base.affinities[i] == move.affinity)
            {
                SAAM = 2
                break;
            }
        }

        let damage = ((((2*enemyFurnimon.level)/5) * move.damage * move.damage * (enemStats.attack + enemStats.special_attack*3)/
                     (thisStats.defense + thisStats.special_defense*3))/50 + 2) * speedMult * SAAM * (1 + random(-0.1, 0.1))
        let message = ""
        let isMessage = false

        //print(damage, move.name, move.damage, move.cost)

        // special defense and acccuracy check
        if (thisStats.special_defense > damage)
        {
            damage = 0
            isMessage = true
            message = String(this.getName()) + " negated the damage" 
        }

        if(random() > enemStats.accuracy)
        {
            damage = 0
            isMessage = true
            message  = String(enemyFurnimon.getName()) + " missed!"
        }

        if(overwrite)
        {
            enemyFurnimon.base.battleStats.energy -= move.cost
            this.base.battleStats.hp = round(this.base.battleStats.hp - damage)
            if (this.base.battleStats.hp < 0)
                this.base.battleStats.hp = 0
            move.specialEffects(enemyFurnimon, this)
            return [damage, isMessage, message]
        }
        else
            return damage
    }
} 