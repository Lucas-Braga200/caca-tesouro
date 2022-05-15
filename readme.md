## Estrutura básica do html

```html
<!-- Select de dificuldade -->
<select id="select-dificuldade">
  <option disabled selected>Dificuldade</option>
  <option value="0">Fácil</option>
  <option value="1">Médio</option>
  <option value="2">Díficil</option>
</select>

<!-- Botão para iniciar o jogo -->
<button id="botao-jogar">Jogar</button>

<!-- Contador -->
<div id="contador">0</div>

<!-- Tabela caça tesouros -->
<table id="tabela-caca-tesouro">
</table>

<!-- Campo de alerta -->
<div id="alerta" class="alerta erro"></div>
```

Eu usei como dificuldades: fácil, médio, díficil. E cada uma tem seu código equivalente: 0, 1, 2.

Quando a opção de dificuldade for resgatada no javascript é a partir desses códigos que será verificado se a opção selecionada é valida ou não.

A tabela do caça tesouros é iniciada vazia, pois as linhas e colunas serão geradas dinâmicamente a partir do javascript.

## Código javascript

### Constantes

Logo no começo do código eu coloquei algumas constantes que serão valores que não vão mudar.

Tem uma constante para quantidade de linhas, outra para quantidade de colunas e alguns objetos literais que é para fazer a validação da dificuldade.

Os objetos literais tem essa sintaxe:

```js
const objetoLiteral = {
  'atributo': 'valor do atributo'
};
```

Para chamar o objeto com o atributo, se utiliza essa sintaxe:

```js
objetoLiteral['atributo'];
// Como retorno teria: 'valor do atributo';

objetoLiteral['atributoNaoExistente'];
// Iria retornar: undefined;
```

Caso fosse passado um atributo que não faz parte do objeto, a linguagem iria retornar "undefined".

Então se eu tentasse passar um valor que não faz parte do objeto de dificuldade, como por exemplo, o valor 4, eu teria um retorno undefined e conseguiria validar se o 4 é uma opção válida ou inválida.

```js
const dificuldades = {
  '0': 'facil',
  '1': 'medio',
  '2': 'dificil'
};
```

Nesse caso, o valor 4 seria inválido, já que ele não é listado no objeto. Mas se eu passasse o valor 0, 1, ou 2 eu receberia o valor equivalente a chave ('facil', 'medio', 'dificil').

```js
let opcaoSelecionada = 10;

if (dificuldades[opcaoSelecionada] == undefined) {
  console.log('Opção invalida.');
} else {
  console.log('Opção válida.');
}
```

Para o objeto "tesourosPorDificuldade" eu coloquei as chaves 0, 1 e 2 e passei os valores 50, 30 e 20.

```js
const tesourosPorDificuldade = {
  '0': 50,
  '1': 30,
  '2': 20
};
```

Isso vai facilitar no momento em que eu tentar acessar a quantidade de tesouros configurado para uma determinada dificuldade.

Exemplo:

```js
tesourosPorDificuldade['0'];
// Retorno: 50;
```

### Valores definidos para o jogo

Nesse trecho do código eu criei algumas variáveis "let" que serão alteradas quando um novo jogo for iniciado.

contador para a quantidade de posições já clicadas.
dificuldadeSelecionada para a dificuldade selecionada no jogo.
numeroTesouros para a quantidade de tesouros no jogo.

### Acessos globais ao html

Os elementos html de tabela, select, botão e div de contador, eu já deixei o acesso a DOM separado, para não ter que fazer isso em várias partes do código.

Utilizando Jquery, eu busquei cada elemento pelo id, por isso a # antes do identificador.

### Funções

#### Função para gerar a tabela do jogo: gerarCacaTesouro

Logo no início há uma linha que chama uma outra função que gera as posições aleatórias de tesouros.

```js
  let tesouros = gerarTesouros(numeroTesouros);
```

Depois esses tesouros serão adicionados as posições...

Essa função percorre através de estruturas de repetição a quantidade de linhas e colunas para criar os elementos html e inserir no "tabelaCacaTesouro".

```js
// Percorre as linhas
for (let i = 0; i < quantidadeLinha; i++) {
  // Cria linha.
  const linha = document.createElement('tr');
  $(linha).addClass('linha');

  // Percorre as colunas
  for (let j = 0; j < quantidadeColuna; j++) {
    // Cria coluna.
    const coluna = document.createElement('td');

    $(coluna).addClass('posicao');
    $(coluna).click(clicarPosicao);
    $(coluna).data('aberto', false);

    // Adiciona as colunas à linha.
    $(linha).append(coluna);
  }

  // Adiciona as linhas à tabela.
  $(tabelaCacaTesouro).append(linha);
}
```

Em um trecho do código eu coloquei um atributo data-set "aberto" para conseguir validar se um campo já foi clicado ou não.

```js
// Setar o valor.
$(coluna).data('aberto', false);

// Recuperar o valor.
$(coluna).data('aberto');
```

Após ter gerado os elementos html, há uma outra estrutura de repetição para alocar os tesouros na posição correta.

```js
for (let i = 0; i < tesouros.length; i++) {
  // Recupera uma lista de linhas.
  let linhas = $('.linha');

  // Recupera a linha, cujo tesouro faz parte.
  let linhaSelecionada = linhas[tesouros[i].x];

  // Recupera todas as colunas da linha selecionada.
  let colunas = $(linhaSelecionada).children();

  // Recupera a coluna, cujo tesouro faz parte.
  let colunaSelecionada = colunas[tesouros[i].y];

  // Adiciona o data-set de tesouro para a posição em questão.
  $(colunaSelecionada).data('tesouro', true);
}
```

#### Função para gerar inteiros aleatórios: inteiroAleatorio

Função genérica para cria um número inteiro randômico entre um min e max, passados como parâmetro.

#### Função para gerar tesouros: gerarTesouros.

Esse função recebe como parâmetro o número de tesouros e cria uma lista de objetos contendo os valores dos eixos x e y para a posição do tesouro.

Exemplo:

```js
[
  {x: 1, y: 10},
  {x: 4, y: 6},
  {x: 8, y: 13},
  {x: 9, y: 3},
  {x: 2, y: 1},
  //...
]
```

Inicialmente há uma estrutura for para gerar todos as posições aleatórias, porém existe a chance dessas posições serem iguais, isso deve ser validado.

```js
let posicao = {
  x: inteiroAleatorio(0, quantidadeLinha-1),
  y: inteiroAleatorio(0, quantidadeColuna-1)
};
```

Para validar foi utilizada uma outra estrutura de repetição while aninhada que verifica a lista de posições já inseridas.

```js
while(j < posicoes.length) {
  // Verifica se o valor é igual.
  if (posicoes[j].x == posicao.x && posicoes[j].y == posicao.y) {
    // Se for igual gera novamente o valor.
    posicao = {
      x: inteiroAleatorio(0, quantidadeLinha-1),
      y: inteiroAleatorio(0, quantidadeColuna-1)
    };
    // Reseta o contador do while para verificar novamente toda a lista de posição.
    j = 0;
  } else {
    // Se não for igual, continua percorrendo a lista.
    j++;
  }
}
```

#### Função executada quando uma posição é clicada: clicarPosicao.

O valor `$(this)` é usado para pegar a posição clicada, ou seja, o valor this é o elemento da tabela clicado.

```js
function clicarPosicao() {
  // Recupera data-set indicando se a posição foi aberta.
  let jaAberta = $(this).data('aberto');

  // Verifica se está aberto ou não.
  if (jaAberta === false) {
    // Não foi aberta.

    contador = contador + 1; // Incrementa contador.
    $(campoContador).text(contador); // Atualiza contador.

    $(this).addClass('aberto'); // Adiciona classe para indicar visualmente que já foi aberto.
    $(this).data('aberto', true); // Atualiza data-set.

    // Recupera data-set indicando se a posição é tesouro ou não.
    let ehTesouro = $(this).data('tesouro');

    // Verifica se é tesouro ou não.
    if (ehTesouro) {
      // Apresenta tesouro.
      $(this).text('T');
      $(campoAlerta).removeClass();
      $(campoAlerta).addClass('sucesso');
      $(campoAlerta).text('Você acertou!');
    } else {
      // Alerta de erro.
      $(campoAlerta).removeClass();
      $(campoAlerta).addClass('erro');
      $(campoAlerta).text('Você errou!');
    }
  } else {
    // Alerta de erro.
    $(campoAlerta).removeClass();
    $(campoAlerta).addClass('erro');
    $(campoAlerta).text('Esta posição já foi aberta!');
  }
}
```

#### Função para gerar resetar os valores do jogo: resetarJogo.

```js
function resetarJogo() {
  contador = 0;
  dificuldadeSelecionada = null;
  numeroTesouros = null;
  $(campoContador).text(contador); // Atualiza o valor do contador 0.
  $(tabelaCacaTesouro).empty(); // Limpa tabela.
  // Limpa alerta.
  $(campoAlerta).removeClass(); 
  $(campoAlerta).text('');
}
```

#### Função para iniciar o jogo: iniciarJogo.

```js
function iniciarJogo() {
  resetarJogo();

  let dificuldade = $(seletorDificuldade).val();

  // Valida dificuldade.
  if (dificuldades[dificuldade] == undefined) {
    // Apresenta alerta.
    $(campoAlerta).removeClass();
    $(campoAlerta).addClass('erro');
    $(campoAlerta).text('Seleciona uma opção correta.');
    return;
  }

  dificuldadeSelecionada = dificuldade;
  numeroTesouros = tesourosPorDificuldade[dificuldade];

  gerarCacaTesouro();
}
```