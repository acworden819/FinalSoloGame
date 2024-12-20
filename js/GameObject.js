class GameObject
{
    constructor(_id=`#default`)
    {     
    /*Object properties (or attributes)*/
    //object position
     this.x=c.width/4;
     this.y=300;
     //object angle
     this.angle = 0;
     //object dimensions
     this.w=20*1.5;
     this.h=35*1.5;
     //object velocity
     this.vx=0;
     this.vy=0;
    //object color
     this.color = `blue`
    //jump boolean
    this.canJump = false;
    this.falling = false;
    this.world = {x:0, y:0}
    this.containerId = 0
    this.stepped = false


     this.img = {
        src:document.querySelector(_id),
        scale:{x:1,y:1},
        w:0,
        h:0,
        sx:0,
        sy:0,
        sw:0,
        sh:0, 
        } 
        this.img.w=this.img.src.width
        this.img.h=this.img.src.height
        this.img.sx=0
        this.img.sy=0
        this.img.sw=this.img.src.width
        this.img.sh=this.img.src.height 
    }

    setImage(_id)
    {
        this.img.src=document.querySelector(_id)
        this.img.w=this.img.src.width
        this.img.h=this.img.src.height
        this.img.sx=0
        this.img.sy=0
        this.img.sw=this.img.src.width
        this.img.sh=this.img.src.height
    }

    graphic(_x=this.x,_y=this.y)
    {
        ctx.save();
        ctx.fillStyle = this.color
        ctx.translate(_x+this.world.x, _y+this.world.y)
        ctx.scale(this.img.scale.x, this.img.scale.y)
        ctx.rotate(this.angle*Math.PI/180)
        ctx.drawImage(
            this.img.src,
            this.img.sx,
            this.img.sy, 
            this.img.sw,
            this.img.sh,
            -this.img.w/2, 
            -this.img.h/2, 
            this.img.w, 
            this.img.h
            )
        ctx.restore();
    }

    //Draws a rectangle 
    render()
    {
        ctx.save();
            ctx.fillStyle = this.color
            ctx.translate(this.x+this.world.x, this.y+this.world.y)
            ctx.rotate(this.angle*Math.PI/180)
            ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h)
        ctx.restore();
    }

    renderImage(image, reverse)
    {
        ctx.save();
            ctx.translate(this.x+this.world.x, this.y+this.world.y)
            ctx.rotate(this.angle*Math.PI/180)
            if(reverse) ctx.scale(-1,1);
            ctx.drawImage(image, -this.w/2, -this.h/2, this.w, this.h)
            ctx.scale(1,1)
        ctx.restore();
    }

    //Moves an object by adding it's velocity to it's position on each axis
    move()
    {
        this.x = this.x + this.vx
        this.y = this.y + this.vy
    }

    //Each function below returns a sides of this object's bounding box
    top()
    {
        return {x:this.x, y:this.y - this.h/2};
    }
    bottomL()
    {
        return {x:this.x-this.w/2, y:this.y + this.h/2 - 1};
    }
    bottomR()
    {
        return {x:this.x+this.w/2, y:this.y + this.h/2 -1};
    }
    left()
    {
        return {x:this.x - this.w/2, y:this.y};
    }
    right()
    {
        return {x:this.x + this.w/2, y:this.y};
    }

    /*-------Collision Function ----------------
    Used to check for collision between 2 objects
    This method checks to see where the various sides of one object are in relationship to another object's sides
    -------------------------------------------*/
    overlaps(_obj)
    {
        if(
            this.top().y+this.world.y < _obj.bottomL().y+_obj.world.y &&
            this.bottomL().y+this.world.y > _obj.top().y+_obj.world.y &&
            this.bottomR().y+this.world.y > _obj.top().y+_obj.world.y &&
            this.left().x+this.world.x < _obj.right().x+_obj.world.x &&
            this.right().x+this.world.x > _obj.left().x+_obj.world.x
        )
        {
            
            return true
        }
        return false;
    }
    isOverPoint(_point)
    {
        if(
            this.top().y+this.world.y < _point.y &&
            this.bottomL().y+this.world.y > _point.y &&
            this.bottomR().y+this.world.y > _point.y &&
            this.left().x+this.world.x < _point.x &&
            this.right().x+this.world.x > _point.x
        )
        {
            return true
        }
        return false; 
    }
}