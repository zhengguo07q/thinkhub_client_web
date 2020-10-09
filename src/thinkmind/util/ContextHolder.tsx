import { SceneContext } from '../util/Interface';
import log, { Logger } from 'loglevel';

export abstract class ContextHolder{
    protected logger:Logger;
    protected static instance:any = null;
    protected sceneContext:SceneContext;

    static build<T extends ContextHolder>(c:{new():T}, sceneContext:SceneContext):T{
        if(this.instance != null){
            return this.instance;
        }
        var interaction:T = new c()
        interaction.sceneContext = sceneContext;
        interaction.logger = log.getLogger(c.name);
        interaction.initialize();
        this.instance = interaction;
        return interaction;
    }

    static getInstance<T extends ContextHolder>():T{
        return this.instance;
    }

    abstract initialize();
    abstract destory();
}
