const AIDifficulties = {
    easy : 0,
    medium : 1
}

class EnemyAI
{ 
    constructor(furnimon, difficulty)
    {
        this.furnimon = furnimon
        this.difficulty = difficulty
        this.maxDamageMoveIndex = -1;
    }

    getNextMove(enemyFurnimon)
    {
        let move = moveList[0];
        switch (this.difficulty)
        {
            case AIDifficulties.easy:
                move = random(this.furnimon.moves)
                break;
            case AIDifficulties.medium:
                let maxDamage = 0;
                for(let i = 0; i < this.furnimon.moves.length; i++)
                {
                    let temp = this.enemyFurnimon.calculateDamage(this.furnimon, this.furnimon.moves[i], false)
                    if(maxDamage < temp)
                    {
                        maxDamage = temp;
                        this.maxDamageMoveIndex = i
                    }
                }  
                move = this.furnimon.moves[this.maxDamageMoveIndex]
                break;
        }
        return move
    }
}
