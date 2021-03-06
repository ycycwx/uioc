/**
 * @file 字典集合插件
 * @author exodia(d_xinxin@163.com)
 */

import u from '../util';
import BasePlugin from './BasePlugin';

const CACHE = Symbol('cache');

/**
 * @private
 */
export default class MapPlugin extends BasePlugin {
    static MAP_COMPONENT_CONFIG = {
        creator: Object,
        isFactory: true
    };

    static MAP_ID = `${(new Date()).getTime()}_map`;

    static has(obj) {
        return u.isObject(obj) && u.isObject(obj.$map);
    }

    get name() {
        return 'map';
    }

    constructor() {
        super();
        this[CACHE] = Object.create(null);
    }

    /**
     * @override
     */
    onContainerInit(ioc, iocConfig) {
        ioc.addComponent(this.constructor.MAP_ID, this.constructor.MAP_COMPONENT_CONFIG);
        return iocConfig;
    }

    /**
     * @override
     */
    onGetComponent(ioc, id, config) {
        if (this[CACHE][id]) {
            return config;
        }

        const {has, MAP_ID} = this.constructor;

        // {$map: {}} => {$import: Map.MAP_ID, properties: {}}
        config.args = config.args.map(
            argConfig => has(argConfig) ? {$import: MAP_ID, properties: argConfig.$map} : argConfig
        );

        let properties = config.properties;
        for (let k in properties) {
            let property = properties[k];
            if (MapPlugin.has(property)) {
                properties[k] = {$import: MAP_ID, properties: property.$map};
            }
        }

        return config;
    }
}
