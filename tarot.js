// [nome, símbolo, significado, palavras-chave]
// Palavras-chave: sem acento; valem como início de palavra ("amor" acha "amores").
// Termine com $ para exigir a palavra exata ("sol$" não acha "solidão").
const CARTAS = [
["O Louco","🃏","Um recomeço e um salto de fé: leveza, liberdade e coragem de ir sem mapa.","liberd aventur sonh viaj nuvem nefelib recomec"],
["O Mago","🎩","O poder de criar com o que se tem nas mãos: palavra, vontade e intenção.","poder criar criac palavr escrev vontad realidad habilidad"],
["A Sacerdotisa","🌙","Silêncio, intuição e os mistérios que só a mente quieta alcança.","mister intui silenc mente espirit conscien segred"],
["A Imperatriz","👑","Beleza, acolhimento e a força feminina que cria e cuida.","mulher feminin natur belez amor mae$ ventre gerar"],
["O Imperador","🏛️","Estrutura, ordem e autoridade — e a pergunta sobre quem faz as regras.","patriarc autorid govern ordem regra sociedad politic"],
["O Hierofante","📿","Tradição, fé e crenças herdadas: o que aceitamos sem questionar.","religi deus igrej tradic dogma crenc ceu$ sagrad"],
["Os Enamorados","💞","Amor, escolhas do coração e a união entre duas almas.","amor paixao casal escolh relacion desejo coracao amar abraco beij carinho"],
["O Carro","🏇","Movimento, determinação e vitória a caminho do destino.","caminh trajet vencer lut direc conquist movimento"],
["A Força","🦁","Coragem serena: a força de quem enfrenta o medo sem endurecer.","coragem forca fort resist posicion medo supera enfrent"],
["O Eremita","🏮","Recolhimento, busca interior e a luz que se acende no silêncio.","solid sozinh reflex introspec filosof pensar pensam busca"],
["A Roda da Fortuna","🎡","Ciclos, mudanças e o acaso movendo a vida.","destino mudanc cicl tempo acaso historia"],
["A Justiça","⚖️","Verdade, equilíbrio e consequências: o que é justo e o que não é.","justic injust verdad equilibr direito julg crimin"],
["O Enforcado","🙃","Pausa, entrega e uma nova perspectiva ao ver o mundo de cabeça para baixo.","sacrific paralis prisao amarr perspectiv espera"],
["A Morte","💀","Fim de ciclo e transformação: algo se encerra para outra coisa nascer.","mort fim$ fogueir renasc transform extin luto"],
["A Temperança","🍷","Equilíbrio, paciência e cura: misturar os opostos com calma.","equilibr calma serenid pacienc harmon cura mente"],
["O Diabo","😈","Desejo, amarras e tentação: o que nos prende e o que podemos soltar.","desejo sexo sexual vicio capital consumo obsess repress"],
["A Torre","🗼","Ruptura súbita: o que é falso desaba para abrir espaço à verdade.","revoluc destru caos queda ruptur guerra crise choro"],
["A Estrela","⭐","Esperança, inspiração e cura depois da tempestade.","esperanc estrela poesia inspir luz$ cura sonh"],
["A Lua","🌛","Sonhos, ilusões e o que se move nas sombras da mente.","ilusao medo sonh noite devane lua$ nuvem mister"],
["O Sol","☀️","Alegria, vitalidade e clareza: tudo que ilumina e aquece.","alegria felic sucesso luz$ sol$ crianc vitalid amor"],
["O Julgamento","📯","Despertar, chamado e renascimento: a hora de se reconhecer.","chamad renasc perdao conscien desperta reflex acord"],
["O Mundo","🌍","Realização, plenitude e a sensação de um ciclo completo.","mundo complet realiz univers viagem integra plenitud"]
];
