play();

async function play() {
    const Jeromy = new Entity({ name: "彭定甫", health: 100, attack: 20, defense: 6, attribute: 1 });
    const Jack = new Entity({ name: "陳承謙", health: 100, attack: 20, defense: 6, attribute: 2 });
    const Jacob = new Entity({ name: "林振可", health: 100, attack: 20, defense: 6, attribute: 3 });
    const Pascal = new Entity({ name: "林哲玄", health: 100, attack: 20, defense: 6, attribute: 4 });
    const Peter = new Entity({ name: "劉益華", health: 100, attack: 20, defense: 6, attribute: 5 });
    const Archie = new Entity({ name: "黃奕齊", health: 140, attack: 10, defense: 6, attribute: 2 });
    const Eric = new Entity({ name: "林書瑋", health: 100, attack: 32, defense: 0, attribute: 4 });
    const Allen = new Entity({ name: "周杯杯", health: 130, attack: 20, defense: 3, attribute: 3 });
    const Stranger = new Entity({ name: "路人", health: 50, attack: 50, defense: 8, attribute: 4 });
    const 林緯翰 = new Entity({ name: "林緯翰", health: 100, attack: 20, defense: 6, attribute: 5 });
    const MathT = new Entity({ name: "周周", health: 100, attack: 26, defense: 4, attribute: 1 });

    const players = [Jeromy, Jack, Jacob, Pascal, Peter, Eric, Allen, Stranger, Archie, MathT, 林緯翰];

    players.forEach((player) => {
        player.on("attacked", (p, d) => {
            log(`[受傷] ${p.name} 受到了 ${d.calc()} 點 ${d.type.text}屬性傷害！`, "orange");
        });
        player.on("dead", (p, d) => {
            log(`[擊殺] ${p.name} 已被 ${d.from.name} 擊殺！`, "#ff4040");
        });
    });

    let round = 0;
    while (more_than_1_survived() && round++ < 100) {
        await sleep(400);
        let survivers = players.filter((player) => player.data.survived);
        let attacker = survivers[Math.floor(Math.random() * survivers.length)];
        let poor_man = survivers[Math.floor(Math.random() * survivers.length)];

        if (attacker.name === poor_man.name) {
            log(`[失誤] ${attacker.name} 不小心攻擊到自己了！`, "#ff5ae2");
        } else {
            log(`[攻擊] ${attacker.name} 攻擊了 ${poor_man.name}！`, "#1ecaff");
        }
        attacker.attack(poor_man);
    }

    log(`[獲勝] ${players.find((player) => player.data.survived).name} 成為了最後的贏家！`, "gold");

    function more_than_1_survived() {
        return players.filter((player) => player.data.survived).length >= 2;
    }
}

function log(msg, color) {
    let console = document.querySelector("#console");
    let span = document.createElement("span");

    span.innerHTML = msg;
    span.style.color = color;

    console.appendChild(span);
    console.appendChild(document.createElement("br"));
}

function sleep(t = 1000) {
    return new Promise((r) => setTimeout(r, t));
}
