interface IObjectState {

  [key: string]: State

}

interface IBindElement extends HTMLElement {

  $name: string;

  $attr: string;

  $state: State;

  updateState(value: any): void;

  updateNode(value: any): void;

  [key: string]: any;

}

class State {

  private $value: any = undefined;

  private $nodeList: Set<IBindElement> = new Set([]);

  public constructor(valueDefault: any) {

    // inicialize value
    this.value = valueDefault;

  }

  public get value() {

    return this.$value;
  }

  public set value(value) {

    this.$value = value;

    // atualiza os elementos com o novo valor
    this.$nodeList.forEach(node => node.updateNode(value));
  }

  public static bind(objectState: IObjectState, node: IBindElement) {

    const bind = node.dataset.bind;

    if (bind !== undefined) {

      const split = bind.split(":");

      if (split.length === 2) {

        // atribui os values
        [node.$name, node.$attr] = split;

        node.$state = objectState[node.$name];

        if (node.$state) {

          // função para atualizar o stado
          node.updateState = function (value) {
            node.$state.value = value;
          }

          // função para atualizar o elemento
          node.updateNode = function (value) {
            node[node.$attr] = value;
          }

          // adicina o elemento ao $state
          node.$state.$nodeList.add(node);

          // executa a primeira iteração
          node.updateState(node.$state.value);
        }

        else throw `State '${node.$name}' não encontrado...`;
      }

      else throw `Formato incorreto em '${bind}'...`;
    }

  }

  public static bindChildren(objectState: IObjectState, parentNode: HTMLElement) {

    const nodeList: NodeListOf<IBindElement> = parentNode.querySelectorAll("[data-bind]");

    for (const node of nodeList) {

      State.bind(objectState, node);

    }
  }
}

export { State, IObjectState };