class Battle {
    constructor() {}
}

class Entity {
    constructor({ name, health, attack, defense, attribute }) {
        this.name = name || "No Name";
        this.data = {
            health: health > 0 ? health : 1,
            attack: attack || 0,
            defense: defense || 0,
            attribute: new Attribute(attribute),
            survived: true,
        };
    }

    listener = {
        attack: () => {},
        attacked: () => {},
        dead: () => {},
    };

    attack(target) {
        if (!Entity.check(target)) throw new Error("Target is not an Entity.");

        let damage = new Damage({ type: this.data.attribute, size: this.data.attack, from: this, to: target });

        this.listener.attack(this, damage);
        target.attacked(damage);
    }

    attacked(damage) {
        if (!Damage.check(damage)) throw new Error("damage is not a Damage.");

        this.data.health -= damage.calc();
        this.listener.attacked(this, damage);

        if (this.data.health <= 0) {
            this.data.survived = false;
            this.listener.dead(this, damage);
        }

        return damage.calc();
    }

    on(event, func) {
        if (typeof event !== "string" || typeof func !== "function") throw new Error("Cannot Set Listener.");
        this.listener[event] = func;
    }

    static check(object) {
        return object instanceof Entity;
    }
}

class Damage {
    constructor({ type, size, from, to }) {
        if (!Entity.check(from) || !Entity.check(to) || !Attribute.check(type)) throw new Error("Cannot construct Damage.");
        this.type = type;
        this.size = size;
        this.from = from;
        this.to = to;
    }

    calc() {
        return +(this.size * Attribute.mp(this.type, this.to.data.attribute) - this.to.data.defense).toFixed(0);
    }

    static check(object) {
        return object instanceof Damage;
    }
}

class Attribute {
    constructor(type) {
        if (typeof type !== "number" || type < 0 || type > 5) throw new Error("Cannot construct Attribute.");

        this.type = type;
        this.text = Attribute.display(type);
    }

    static check(object) {
        return object instanceof Attribute;
    }

    static display(type) {
        if (typeof type !== "number" || type < 0 || type > 5) throw new Error("Cannot identify attribute type.");
        switch (type) {
            case 1:
                return "水";
            case 2:
                return "火";
            case 3:
                return "木";
            case 4:
                return "光";
            case 5:
                return "暗";
        }
    }

    static mp(attr1, attr2) {
        if (!Attribute.check(attr1) || !Attribute.check(attr2)) throw new Error("Cannot calculate from non-Attribute element.");

        if (attr1.type <= 3 && attr2.type <= 3) {
            if (attr1.type === 1 && attr2.type === 2) return 1.6;
            if (attr1.type === 2 && attr2.type === 3) return 1.6;
            if (attr1.type === 3 && attr2.type === 1) return 1.6;
            if (attr1.type === 2 && attr2.type === 1) return 0.7;
            if (attr1.type === 3 && attr2.type === 2) return 0.7;
            if (attr1.type === 1 && attr2.type === 3) return 0.7;
        } else if (attr1.type > 3 && attr2.type > 3) {
            if (attr1.type !== attr2.type) return 1.3;
        }

        return 1;
    }
}
