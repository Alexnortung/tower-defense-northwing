class MovableObject extends GameObject
{
    constructor(game, position,size, options)
    {
        super(game, position, size, options);
        this._onLadder = false;

        this.velocity = new Vector(0,0);
        this.maxVelocity = Infinity;
        if (typeof options === "object") {
          typeof options.health === "number"? this.health = options.health: this.health = 100;
          typeof options.hasGrivity === "boolean"? this.hasGrivity = options.hasGrivity : this.hasGrivity = true;
          typeof options.canHasGravity === "boolean" ? this.canHasGravity = options.canHasGravity : this.canHasGravity = true;
        }

        this.isGrounded = false;

    }

    setVelocity(velocity)
    {
        this.velocity = velocity;
    }

    enterLadder(){
      this.hasGravity = false;
      this._onLadder = true;
    }

    leaveLadder() {
      if (this.canHasGravity) {
        this.hasGravity = true;

      }
      this._onLadder = false;

    }


    update(){
      //add gravity to velocity
      if (this.hasGrivity) {
        this.velocity.addTo(game.gravity);

      }

      //check collisions
      const collisions = this.game.checkCollisions(this);
      if(collisions.length == 0){
        this.isGrounded = false;
      }
      for (var i = 0; i < collisions.length; i++) {
        //set velocity
        if (this.isSolid) {
          if (collisions[i].x) {
            this.velocity.x = 0;
          }
          if (collisions[i].y) {
            this.velocity.y = 0;
          }

        }

        //call oncollide
        if (typeof collisions[i].elem.onCollide === "function") {
          collisions[i].elem.onCollide(this);
        }
        if (typeof this.onCollide === "function") {
          this.onCollide(elem);
        }

      }

      //check ladder
      const ladders = game.checkLadder(this);
      if (ladders.length >= 1 && !this._onLadder) {
        this.enterLadder();
      } else if (ladders.length == 0 && this._onLadder) {
        this.leaveLadder();
      }


      //check max movement



      this.position = this.position.add(this.velocity);


    }

}
