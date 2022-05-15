// Constantes.

const quantidadeLinha = 10;

const quantidadeColuna = 20;

const dificuldades = {
  '0': 'facil',
  '1': 'medio',
  '2': 'dificil'
};

const tesourosPorDificuldade = {
  '0': 50,
  '1': 30,
  '2': 20
};



// Valores definidos para o jogo.

let contador = 0;
let dificuldadeSelecionada = null;
let numeroTesouros = null;



// Acessos globais ao html.

const tabelaCacaTesouro = $('#tabela-caca-tesouro');
const campoContador = $('#contador');
const botaoJogar = $('#botao-jogar');
const seletorDificuldade = $('#select-dificuldade');
const campoAlerta = $('#alerta');



// Funções

function gerarCacaTesouro() {
  let tesouros = gerarTesouros(numeroTesouros);

  for (let i = 0; i < quantidadeLinha; i++) {
    const linha = document.createElement('tr');
    $(linha).addClass('linha');

    for (let j = 0; j < quantidadeColuna; j++) {
      const coluna = document.createElement('td');

      $(coluna).addClass('posicao');
      $(coluna).click(clicarPosicao);
      $(coluna).data('aberto', false);

      $(linha).append(coluna);
    }

    $(tabelaCacaTesouro).append(linha);
  }

  for (let i = 0; i < tesouros.length; i++) {
    let linhas = $('.linha');
    let linhaSelecionada = linhas[tesouros[i].x];
    let colunas = $(linhaSelecionada).children();
    let colunaSelecionada = colunas[tesouros[i].y];
    $(colunaSelecionada).data('tesouro', true);
  }
}

function inteiroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function gerarTesouros(numero) {
  let posicoes = new Array();

  for (let i = 0; i < numero; i++) {
    let posicao = {
      x: inteiroAleatorio(0, quantidadeLinha-1),
      y: inteiroAleatorio(0, quantidadeColuna-1)
    };
    let j = 0;

    while(j < posicoes.length) {
      if (posicoes[j].x == posicao.x && posicoes[j].y == posicao.y) {
        posicao = {
          x: inteiroAleatorio(0, quantidadeLinha-1),
          y: inteiroAleatorio(0, quantidadeColuna-1)
        };
        j = 0;
      } else {
        j++;
      }
    }

    posicoes.push(posicao);
  }

  return posicoes;
}

function clicarPosicao() {
  let jaAberta = $(this).data('aberto');
  if (jaAberta === false) {
    contador = contador + 1;
    $(campoContador).text(contador);
    $(this).addClass('aberto');
    $(this).data('aberto', true);

    let ehTesouro = $(this).data('tesouro');
    if (ehTesouro) {
      $(this).text('T');
      $(campoAlerta).removeClass();
      $(campoAlerta).addClass('sucesso');
      $(campoAlerta).text('Você acertou!');
    } else {
      $(campoAlerta).removeClass();
      $(campoAlerta).addClass('erro');
      $(campoAlerta).text('Você errou!');
    }
  } else {
    $(campoAlerta).removeClass();
    $(campoAlerta).addClass('erro');
    $(campoAlerta).text('Esta posição já foi aberta!');
  }
}

function resetarJogo() {
  contador = 0;
  dificuldadeSelecionada = null;
  numeroTesouros = null;
  $(campoContador).text(contador);
  $(tabelaCacaTesouro).empty();
  $(campoAlerta).removeClass();
  $(campoAlerta).text('');
}

function iniciarJogo() {
  resetarJogo();

  let dificuldade = $(seletorDificuldade).val();

  if (dificuldades[dificuldade] == undefined) {
    $(campoAlerta).removeClass();
    $(campoAlerta).addClass('erro');
    $(campoAlerta).text('Seleciona uma opção correta.');
    return;
  }

  dificuldadeSelecionada = dificuldade;
  numeroTesouros = tesourosPorDificuldade[dificuldade];

  gerarCacaTesouro();
}



// Aloca evento de iniciarJogo ao botão.
$('#botao-jogar').click(iniciarJogo);