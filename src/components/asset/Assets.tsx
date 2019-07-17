import React, { Component } from 'react';
import Icon from 'polestar-icons';
import { Entity } from 'aframe';
import { Modal, Tree, Spin } from 'antd';
import uuid from 'uuid/v4';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';

import { SidebarContainer } from '../common';
import { EventTools } from '../../tools';
import { IScene } from '../../tools/InspectorTools';
import { IEntity, getIcon } from '../../constants';
import AddEmpty from '../common/AddEmpty';
import { capitalize } from '../../tools/UtilTools';

interface IState {
    assets: IEntity[];
    visible: boolean;
    selectedKeys: string[];
    spinning: boolean;
}

class Assets extends Component<{}, IState> {
    state: IState = {
        assets: [],
        visible: false,
        selectedKeys: [],
        spinning: true,
    }

    componentDidMount() {
        EventTools.on('sceneloaded', (scene: IScene) => {
            const assets = this.buildAssets(scene);
            this.setState({
                assets,
                spinning: false,
            });
        });
    }

    /**
     * 
     * @description Building assets
     * @param {IScene} scene
     * @returns {IEntity[]} assets
     */
    private buildAssets = (scene: IScene) => {
        const assets: IEntity[] = [];
        if (scene.firstElementChild.id === 'assets') {
            for (let i = 0; i < scene.firstElementChild.children.length; i++) {
                const en = scene.firstElementChild.children[i] as Entity;
                if (!en.id) {
                    en.id = uuid();
                }
                let title;
                if (en.title) {
                    title = en.title;
                } else if (en.id) {
                    title = capitalize(en.id);
                } else {
                    title = en.tagName;
                }
                assets.push({
                    key: en.id,
                    type: en.tagName.toLowerCase(),
                    title,
                    entity: en,
                    icon: getIcon(en.tagName.toLowerCase()),
                });
            }
            return assets;
        }
        return assets;
    }

    /**
     * @description Change to visible in Modal
     */
    private handleModalVisible = () => {
        this.setState((prevState: IState) => {
            return {
                visible: !prevState.visible,
            };
        });
    }

    /**
     * @description Select the asset
     * @param {string[]} selectedKeys
     * @param {AntTreeNodeSelectedEvent} e
     */
    private handleSelectAsset = (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => {
        console.log(e.node.props.dataRef.entity);
        this.setState({
            selectedKeys,
        });
    }

    private handleDeleteAsset = () => {

    }

    /**
     * @description Render the tree node
     * @param {IEntity} item
     * @returns
     */
    private renderTreeNode = (item: IEntity) => {
        return (
            <Tree.TreeNode
                key={item.key.toString()}
                title={item.title}
                icon={<Icon name={item.icon} />}
                dataRef={item}
            />
        );
    }

    render() {
        const { assets, visible, spinning } = this.state;
        return (
            <SidebarContainer
                titleStyle={{ border: 0 }}
                title={
                    <>
                        <div style={{ flex: 1 }}>{'Assets'}</div>
                        <div>
                            <Icon className="editor-icon" style={{ fontSize: '1.25rem', marginRight: 8 }} name="plus" onClick={this.handleModalVisible} />
                            <Icon className="editor-icon" style={{ fontSize: '1.25rem' }} name="trash" onClick={this.handleDeleteAsset} />
                        </div>
                    </>
                }
                spinning={spinning}
            >
                {
                    assets.length ? (
                        <Tree
                            showIcon={true}
                            onSelect={this.handleSelectAsset}
                        >
                            {assets.map(asset => this.renderTreeNode(asset))}
                        </Tree>
                    ) : <AddEmpty onClick={this.handleModalVisible} />
                }
                <Modal
                    className="editor-item-modal"
                    title={'Add Assets'}
                    visible={visible}
                    onCancel={this.handleModalVisible}
                    footer={null}
                    width="75%"
                    style={{ height: '75%' }}
                >
                    test
                </Modal>
            </SidebarContainer>
        );
    }
}

export default Assets;
