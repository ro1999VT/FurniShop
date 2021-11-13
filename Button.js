class Button
{ 
    constructor(x, y ,bwidth, bheight, curve = 0, fillVal = color(255), stroke = false, strokeWeight = 0, strokeFill = color(0), overFill = color(150), clickFill = color(50))
    {
        this.x = x;
        this.y = y;
        this.width = bwidth;
        this.height = bheight;
        this.curve = curve;

        this.wasClicked = false;

        this.fill = fillVal;
        this.overFill = overFill;
        this.clickFill = clickFill;
        this.stroke = stroke;
        this.strokeFill = strokeFill;
        this.strokeWeight = strokeWeight;
    }

    mouseOver()
    {
        return (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height);
    }

    clicked(reset=true)
    {
        if(reset)
        {
            if(this.wasClicked)
            {
                this.wasClicked = false;
                return true
            }
            else
                return false
        }
        else
            return this.wasClicked;
    }

    draw(fadeVal = 255)
    {
        if(this.mouseOver())
        {
            if(mouseIsPressed && mouseButton == LEFT)
            {
                fill(this.clickFill,fadeVal);
                this.wasClicked = true;
            }
            else
                fill(this.overFill,fadeVal);
        }
        else
            fill(this.fill,fadeVal);
        if (this.stroke)
        {
            stroke(this.strokeFill,fadeVal);
            strokeWeight(this.strokeWeight);
        }
        else
            noStroke();

        rect(this.x, this.y, this.width, this.height, this.curve);
    }

}
