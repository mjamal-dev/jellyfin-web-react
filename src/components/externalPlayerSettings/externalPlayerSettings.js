import dialogHelper from '../dialogHelper/dialogHelper';
import globalize from '../../lib/globalize';
import * as userSettings from '../../scripts/settings/userSettings';
import layoutManager from '../layoutManager';
import scrollHelper from '../../scripts/scrollHelper';
import '../../elements/emby-checkbox/emby-checkbox';
import '../../elements/emby-radio/emby-radio';
import '../formdialog.scss';
import 'material-design-icons-iconfont';
import template from './externalPlayerSettings.template.html';

function save(context) {
    const selectedRadioButton = context.querySelector('input[name="externalPlayer"]:checked');

    if (selectedRadioButton) {
        const selectedValue = selectedRadioButton.value;
        console.log('Selected Value:', selectedValue);
        userSettings.set('externalplayerpreference', selectedValue);
        // Use the selectedValue as needed
    } else {
        console.log('No radio button selected.');
    }
}

function load(context) {
    const selectedPlayer = userSettings.get('externalplayerpreference');
    if (selectedPlayer) {
        console.log('Selected Player:', selectedPlayer);
        const selectedRadioButton = context.querySelector(`input[name="externalPlayer"][value="${selectedPlayer}"]`);
        selectedRadioButton.checked = true;
    }
}

function showEditor(options) {
    return new Promise(function (resolve, reject) {
        let settingsChanged = false;

        const dialogOptions = {
            removeOnClose: true,
            scrollY: false
        };

        if (layoutManager.tv) {
            dialogOptions.size = 'fullscreen';
        } else {
            dialogOptions.size = 'small';
        }

        const dlg = dialogHelper.createDialog(dialogOptions);

        dlg.classList.add('formDialog');

        let html = '';

        html += globalize.translateHtml(template, 'core');

        dlg.innerHTML = html;

        dlg.addEventListener('change', function () {
            settingsChanged = true;
        });

        dlg.addEventListener('close', function () {
            if (layoutManager.tv) {
                scrollHelper.centerFocus.off(dlg.querySelector('.formDialogContent'), false);
            }

            save(dlg);
            if (settingsChanged) {
                resolve();
            } else {
                reject();
            }
        });

        dlg.querySelector('.btnCancel').addEventListener('click', function () {
            dialogHelper.close(dlg);
        });

        if (layoutManager.tv) {
            scrollHelper.centerFocus.on(dlg.querySelector('.formDialogContent'), false);
        }
        load(dlg);
        dialogHelper.open(dlg);
    });
}

export default {
    show: showEditor
};
