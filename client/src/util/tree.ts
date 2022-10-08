import { isEmpty, map } from 'lodash';

export class TreeBuilder {
    static buildTreeFromFlatData = <T extends Record<string, any>>(
        items: T[],
        idKey: string,
        parentKey: string,
        childrenKey: string,
    ) => {
        const tree = [];
        const mappedArr: {
            [key: string]: any;
        } = {};
        let arrElem;
        let mappedElem;

        // First map the nodes of the array to an object -> create a hash table.
        for (let i = 0, len = items.length; i < len; i++) {
            arrElem = items[i];
            mappedArr[arrElem[idKey]] = arrElem;
            mappedArr[arrElem[idKey]][childrenKey] = [];
        }

        for (const id in mappedArr) {
            if (mappedArr.hasOwnProperty(id)) {
                mappedElem = mappedArr[id];
                // If the element is not at the root level, add it to its parent array of children.
                if (mappedElem[parentKey] && mappedArr[mappedElem[parentKey]]) {
                    mappedArr[mappedElem[parentKey]][childrenKey].push(mappedElem);
                }
                // If the element is at the root level, add it to first level elements array.
                else {
                    tree.push(mappedElem);
                }
            }
        }
        // this.checkEmptyChildren(tree, tree.length - 1, childrenKey);
        return tree;
    };

    // static checkEmptyChildren = <T extends Record<string, any>>(items: T[], index: number, childrenKey: string) => {
    //     let children = items[index][childrenKey];
    //     if (children.length && children.length <= 0) {
    //         children = null;
    //     }
    //     return
    // };

    static onParseTreeToFlatData = (data: any, arr: any) => {
        map(data, item => {
            if (!isEmpty(item.children)) {
                this.onParseTreeToFlatData(item.children, arr);
            }
            if (!item.notLeaf) {
                arr.push(item);
            }
        });
    };
}
