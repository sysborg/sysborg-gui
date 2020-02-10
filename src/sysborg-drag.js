class sysborg_drag{
/**
    * @description-pt-BR        Prepara a classe para suas funcionalidades
    * @description-en-US        Prepare class for it functionalities
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    HTMLElement element
    * @param                    Object configs{
        'fade': boolean - 'pt-BR: se esmaece quando drag ativo | en-US if fadeout when drag is active',
        'cursor-position': [(string) axis x, (string) axis y] - 'pt-BR: eixo x e eixo y do posicionamento entre o objeto e o cursor | en-US: axis x and axis y of position between object and cursor',
        'drag-trigger': string - 'pt-BR: HTMLElement que ativa o movimento do elemento | en-US HTMLElement that activate the element movement',
        'style': {'property': value, ...} - 'pt-BR: style personalizável quando o drag está ativo | en-US: personalized style when drag is activated'
    }
    * @return                   void
**/
    constructor(element, configs={}){
        this.configs = configs;
        this.element = element;
        this.element.style.transtion = "opacity 0.5s";

        let obj = this;
        this.drag_trigger = this.element.querySelectorAll('#'+ this.configs['drag-trigger'])[0] || null;

        if(this.drag_trigger==null){
            this.element.addEventListener('mousedown', (event) => {
                obj.start_drag(event);
            });
        } else{
            this.drag_trigger.addEventListener('mousedown', (event) => {
                obj.start_drag(event);
            });
        }

        document.addEventListener('mouseup', (event) => {
            obj.stop_drag(event);
        });

        document.addEventListener('mousemove', (event) => {
            obj.drag_move(event);
        });
    }

/**
    * @description-pt-BR        Cálcula posicionamento, seta styles da classe e personalizáveis e inicia o drag
    * @description-en-US        Calculates position, set styles of class and personalized and start drag
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    event
    * @return                   void
**/
    start_drag(event){
        if(!this.configs.hasOwnProperty('cursor-position'))
            this.configs['cursor-position'] = ['initial', 'initial'];

        let obj = this;

        let element_styles = {
            'position': 'absolute',
            ...this.configs['style']
        };

        if(this.configs.hasOwnProperty('fade') && this.configs['fade'])
            element_styles['opacity'] = '0.7';

        if(this.configs['cursor-position'][0] in this){
            element_styles['left'] = this[this.configs['cursor-position'][0]](event.clientX) + 'px';
        } else{
            this.width_diff = event.clientX - this.element.offsetLeft;
        }

        if(this.configs['cursor-position'][1] in this){
            element_styles['top'] = this[this.configs['cursor-position'][1]](event.clientY) + 'px';
        } else{
            this.height_diff = event.clientY - this.element.offsetTop;
        }

        Object.assign(this.element.style, element_styles);
        this.element.setAttribute('drag-on', '1');
    }

/**
    * @description-pt-BR        Movimenta o objeto pela tela conforme a posição do cursor, somente se o clique do mouse estiver ativo
    * @description-en-US        Moves the object on the screen according to cursor position, only if mouse down activated
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    event
    * @return                   void
**/
    drag_move(event){
        if(this.element.hasAttribute('drag-on')){
            Object.assign(this.element.style, {
                'left': (event.clientX - this.width_diff) + 'px',
                'top': (event.clientY - this.height_diff) + 'px'
            });
        }
    }

/**
    * @description-pt-BR        Para a propagação do evento move do drag e seta o style original
    * @description-en-US        Stop propagation of drag move event and set the original styles
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    event
    * @return                   void
**/
    stop_drag(event){
        this.element.removeAttribute('drag-on');
        this.element.style.opacity = 1;
        for(let styles in this.configs['style']){
            if(this.configs['style'].hasOwnProperty(styles)){
                this.element.style.removeProperty(styles);
            }
        }
    }

/**
    * @description-pt-BR        Retornas as coordenadas atuais do objeto em pixels
    * @description-en-US        Returns actual coordinates of object in pixels
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    
    * @return                   {'left': int, 'center': int, 'right': int, 'width': int, 'top': int, 'middle': int, 'bottom': int, 'height': int}
**/
    get_coords(){
        return {
            'left': this.element.offsetLeft,
            'center': (this.element.offsetWidth / 2) + this.element.offsetLeft,
            'right': this.element.offsetLeft + this.element.offsetWidth,
            'width': this.element.offsetWidth,
            'top': this.element.offsetTop,
            'middle': (this.element.offsetHeight / 2) + this.element.offsetTop,
            'bottom': this.element.offsetTop + this.element.offsetHeight,
            'height': this.element.offsetHeight
        }
    }

/**
    * @description-pt-BR        Cálcula a diferença de posição entre o objeto e o cursor para centralizar o cursor Eixo X
    * @description-en-US        Calculates the difference of position between the object and cursor to centralize the cursor Axis X
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    int cuursor_x "pt-BR: posição do mouse no eixo x | en-US: position of mouse's cursor on axis x"
    * @return                   number
**/
    center(cursor_x){
        this.width_diff = (this.drag_trigger==null) ? (this.element.offsetWidth / 2) : (this.drag_trigger.offsetWidth / 2);
        return cursor_x - this.width_diff;
    }

/**
    * @description-pt-BR        Cálcula a diferença de posição entre o objeto e o cursor para o cursor ficar a esquerda do objeto Eixo X
    * @description-en-US        Calculates the difference of position between the object and cursor to the cursor stay on left of object Axis X
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    int cuursor_x "pt-BR: posição do mouse no eixo x | en-US: position of mouse's cursor on axis x"
    * @return                   number
**/
    left(cursor_x){
        this.width_diff = 0;
        return cursor_x;
    }

/**
    * @description-pt-BR        Cálcula a diferença de posição entre o objeto e o cursor para o cursor ficar a direita do objeto Eixo X
    * @description-en-US        Calculates the difference of position between the object and cursor to the cursor stay at right of object Axis X
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    int cuursor_x "pt-BR: posição do mouse no eixo x | en-US: position of mouse's cursor on axis x"
    * @return                   number
**/
    right(cursor_x){
        this.width_diff = (this.drag_trigger==null) ? this.element.offsetWidth : this.drag_trigger.offsetWidth;
        return cursor_x - this.width_diff;
    }

/**
    * @description-pt-BR        Cálcula a diferença de posição entre o objeto e o cursor para o cursor ficar no topo do objeto Eixo Y
    * @description-en-US        Calculates the difference of position between the object and cursor to the cursor stay at top of object Axis Y
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    int cuursor_y "pt-BR: posição do mouse no eixo y | en-US: position of mouse's cursor on axis y"
    * @return                   number
**/
    top(cursor_y){
        this.height_diff = 0;
        return cursor_y;
    }

/**
    * @description-pt-BR        Cálcula a diferença de posição entre o objeto e o cursor para o cursor ficar no centro do objeto Eixo Y
    * @description-en-US        Calculates the difference of position between the object and cursor to the cursor stay at middle of object Axis Y
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    int cuursor_y "pt-BR: posição do mouse no eixo y | en-US: position of mouse's cursor on axis y"
    * @return                   number
**/
    middle(cursor_y){
        this.height_diff = (this.drag_trigger==null) ? (this.element.offsetHeight / 2) : (this.drag_trigger.offsetHeight / 2);
        return cursor_y - this.height_diff;
    }

/**
    * @description-pt-BR        Cálcula a diferença de posição entre o objeto e o cursor para o cursor ficar no rodapé do objeto Eixo Y
    * @description-en-US        Calculates the difference of position between the object and cursor to the cursor stay at bottom of object Axis Y
    * @version                  1.0.0
    * @author                   Anderson Matheus Arruda < anderson at sysborg dot com dot br>
    * @param                    int cuursor_y "pt-BR: posição do mouse no eixo y | en-US: position of mouse's cursor on axis y"
    * @return                   number
**/
    bottom(cursor_y){
        this.height_diff = (this.drag_trigger==null) ? this.element.offsetHeight : this.drag_trigger.offsetHeight;
        return cursor_y - this.height_diff;
    }
}