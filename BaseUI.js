const timerTypes = {
    stopTimer : 0,
    resetTimer : 1,
    reverseTimer : 2
}

class BaseUI
{ 
    constructor(animStarts, maxAnimTimers, startTimers, timerType, operation, tick)
    {
        this.animStarts = animStarts;
        this.animTimers = [];
        for (let i = 0; i < this.animStarts.length; i ++)
            this.animTimers.push(this.animStarts[i])
        this.maxAnimTimers = maxAnimTimers;
        this.startTimers = startTimers;
        this.timerType = timerType;
        this.operation = operation;
        this.tick = tick;

        this.lengthAnims = this.animTimers.length;
    }

    screenClicked() { return (mouseIsPressed && mouseButton == LEFT); }

    runAnim(index, val = true) { this.startTimers[index] = val; }

    getAnimVal(index) { return this.animTimers[index]; }

    animComplete(index) { return !this.startTimers[index]; }

    animCompleted(index) 
    {
        let bool;
        if (this.operation[index])
            bool = this.animTimers[index] >= this.maxAnimTimers[index];
        else
            bool = this.animTimers[index] <= this.maxAnimTimers[index];
        return bool;
    }

    reset(index, start = false)
    {
        this.animTimers[index] = this.animStarts[index];
        this.startTimers[index] = start;
        if (this.timerType[index] == timerTypes.reverseTimer && !this.operation[index])
        {
            let temp = this.maxAnimTimers[index];
            this.maxAnimTimers[index] = this.animStarts[index];
            this.animStarts[index] = temp;
        }
    }

    resetAll()
    {
        for(let i = 0; i < this.lengthAnims; i++)
            this.reset[i];
    }

    update()
    {
        for(let i = 0; i < this.lengthAnims; i++)
        {
            let bool;
            if (this.operation[i])
                bool = this.animTimers[i] < this.maxAnimTimers[i];
            else
                bool = this.animTimers[i] > this.maxAnimTimers[i];
            if (bool)
            {
                if(this.startTimers[i])
                {
                    if(this.operation[i])
                        this.animTimers[i] += this.tick[i];
                    else
                        this.animTimers[i] -= this.tick[i];
                }
            }
            else
            {
                if (this.timerType[i] == timerTypes.stopTimer)
                    this.runAnim(i, false)
                else if (this.timerType[i] == timerTypes.resetTimer)
                    this.animTimers[i] = this.animStarts[i];
                else
                {
                    this.operation[i] = !this.operation[i];
                    let temp = this.maxAnimTimers[i];
                    this.maxAnimTimers[i] = this.animStarts[i];
                    this.animStarts[i] = temp;
                }
            }
        }
    }
}
