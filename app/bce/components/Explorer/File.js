/**
 * Component - File Component
 *
 * @file File.js
 * @author mudio(job.mudio@gmail.com)
 */

/* eslint no-underscore-dangle: [2, { "allowAfterThis": true }] */

import {remote} from 'electron';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component, PropTypes} from 'react';

import styles from './File.css';
import * as ExplorerActons from '../../actions/explorer';

class File extends Component {
    static propTypes = {
        region: PropTypes.string.isRequired,
        prefix: PropTypes.string.isRequired,
        bucketName: PropTypes.string.isRequired,
        object: PropTypes.shape({
            key: PropTypes.string.isRequired,
            lastModified: PropTypes.string.isRequired,
            ETag: PropTypes.string,
            Size: PropTypes.number
        }),
        onContextMenu: PropTypes.func.isRequired,
        view: PropTypes.func.isRequired,
        rename: PropTypes.func.isRequired,
        share: PropTypes.func.isRequired,
        download: PropTypes.func.isRequired,
        copy: PropTypes.func.isRequired,
        move: PropTypes.func.isRequired,
        trash: PropTypes.func.isRequired
    };

    _onDownload() {
        // 选择文件夹
        const {download, object} = this.props;
        const path = remote.dialog.showOpenDialog({properties: ['openDirectory']});
        // 用户取消了
        if (path === undefined) {
            return;
        }
        // 不支持选择多个文件夹，所以只取第一个
        download(object.key, path[0]);
    }

    _trash() {
        const {region, bucketName, prefix, object, trash} = this.props;

        const comfirmTrash = !remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            message: `您确定删除${object.key}?`,
            title: '删除提示',
            buttons: ['删除', '取消'],
            cancelId: 1
        });

        if (comfirmTrash) {
            trash(region, bucketName, prefix, [object.key]);
        }
    }

    _onContextMenu(evt) {
        evt.preventDefault();
        const {
            onContextMenu
            // view, rename, share,
            // item, copy, move, trash
        } = this.props;

        onContextMenu([
            // {name: '查看', icon: 'low-vision', click: () => view(item, ObjectType)},
            // {name: '重命名', icon: 'pencil', click: () => rename(item, ObjectType)},
            // {name: '分享', icon: 'chain', click: () => share(item, ObjectType)},
            {name: '下载', icon: 'cloud-download', click: () => this._onDownload()},
            // {name: '复制', icon: 'copy', click: () => copy(item, ObjectType)},
            // {name: '移动到', icon: 'arrows', click: () => move(item, ObjectType)},
            {name: '删除', icon: 'trash', click: () => this._trash()}
        ], evt.clientX, evt.clientY);
    }

    render() {
        const {key} = this.props.object;
        const ext = key.split('.').pop().toLowerCase();
        const fileName = key.replace(/(.*\/)(.*)$/, '$2');

        return (
            <div onContextMenu={evt => this._onContextMenu(evt)}
                className={styles.container}
            >
                <i className={`${styles.fileicon} asset-normal asset-${ext}`} />
                <span className={styles.text} title={fileName}>{fileName}</span>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ExplorerActons, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(File);
