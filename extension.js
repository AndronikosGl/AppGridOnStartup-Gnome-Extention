import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

let signalId = null;

const settings = new Gio.Settings({
    schema: 'org.gnome.desktop.interface',
});

export default class Extension {
    constructor() {
        // No heavy logic here; just object creation if needed
    }

    enable() {
        // If GNOME is already running, do nothing
        if (!Main.layoutManager._startingUp) return;

        // Connect to startup-complete signal
        signalId = Main.layoutManager.connect('startup-complete', () => {
            Main.layoutManager.disconnect(signalId);
            signalId = null;
            this._openAppGrid();
        });
    }

    disable() {
        if (signalId) {
            Main.layoutManager.disconnect(signalId);
            signalId = null;
        }
    }

    _openAppGrid() {
        const prev = settings.get_boolean('enable-animations');
        settings.set_boolean('enable-animations', false);

        Main.overview.showApps();

        settings.set_boolean('enable-animations', prev);
    }
}

