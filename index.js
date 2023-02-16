class Starship {
    state = 'active';
    shieldEnergyInitial = 10000;
    phaserChargeInitial  = 10000;

    constructor(
        phaserChargeInitial,
        numberOfPhotonTorpedos,
        energyPerPhotonTorpedo,
        shieldEnergyInitial,
        FleetDesignation
    ) {
        this.phaserChargeInitial = phaserChargeInitial;
        this.numberOfPhotonTorpedos = numberOfPhotonTorpedos;
        this.energyPerPhotonTorpedo = energyPerPhotonTorpedo;
        this.shieldEnergyInitial = shieldEnergyInitial;
        this.FleetDesignation = FleetDesignation;
    }

    getFireAttackValue() {
        let powerUsed = Math.floor(Math.random() * (300) * this.energyPerPhotonTorpedo);
        if (powerUsed > this.phaserChargeInitial) {
            powerUsed = this.phaserChargeInitial;
        }
        --this.numberOfPhotonTorpedos;
        this.phaserChargeInitial -= powerUsed;
        if (this.numberOfPhotonTorpedos <= 0) {
            this.destroy();
        }
        if (this.phaserChargeInitial <= 0) {
            this.destroy();
        }
        return powerUsed;
    }

    attackByFire(hitValue) {
        this.shieldEnergyInitial -= hitValue;
        if (this.shieldEnergyInitial < 0) {
            this.destroy();
        }
    }

    destroy() {
        this.state = 'dead';
        console.log(this.FleetDesignation + " ship is dead")
    }

    report(index) {
        return this.FleetDesignation + " #" + index + " (" + this.numberOfPhotonTorpedos + "/" + this.phaserChargeInitial + ")";
    }
}

const FederationOrderOfBattle = [];
const RomulanOrderOfBattle = [];

for (let i = 0; i < 10; i++) {
    RomulanOrderOfBattle.push(new Starship(
        10000,
        25,
        25,
        10000,
        "Seneca")
    );
    FederationOrderOfBattle.push(new Starship(
        10000,
        25,
        25,
        10000,
        "Lambton")
    );
}

class Battle {
    attackTeamID = null;
    teamOne = [];
    teamTwo = [];

    constructor(
        teamOne,
        teamTwo,
        attackTeamID,
    ) {
        this.teamOne = teamOne;
        this.teamTwo = teamTwo;
        this.attackTeamID = attackTeamID;
    }

    async start()  {
        while (true) {
            console.log("Team Lambton Ships: " + this.teamOne.length);
            console.log("Team Seneca Ships: " + this.teamTwo.length);
            if (this.attackTeamID === 'Seneca') {
                this.attack(this.teamOne, this.teamTwo);
                this.attackTeamID = 'Lambton';
            } else {
                this.attack(this.teamTwo, this.teamOne);
                this.attackTeamID = 'Seneca';
            }
            this.teamOne = this.teamOne.filter(value => value.state === 'active');
            this.teamTwo = this.teamTwo.filter(value => value.state === 'active');
            if (this.teamTwo.length === 0) {
                console.log("Lambton team won");
                break;
            }
            if (this.teamOne.length === 0) {
                console.log("Seneca team won");
                break;
            }

            await sleep(2000);
        }

    }

    attack(target, attacking) {
        const attackingShipIndex = Math.floor(Math.random() * attacking.length);
        const targetShipIndex = Math.floor(Math.random() * target.length);
        const attackingShip = attacking.at(attackingShipIndex);
        const targetShip = target.at(targetShipIndex);
        const fireValue = attackingShip.getFireAttackValue();
        console.log("Fire value : " + fireValue);
        targetShip.attackByFire(fireValue);
        console.log("                                     ");
    }
}

const battle = new Battle(
    FederationOrderOfBattle,
    RomulanOrderOfBattle,
    "Seneca"
);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

battle.start();