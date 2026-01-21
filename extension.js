import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class AppGridOnStartup {

    enable() {
        if (!Main.layoutManager._startingUp)
            return;

        this._settings = new Gio.Settings({
            schema: 'org.gnome.desktop.interface',
        });

        Main.layoutManager.connectObject(
            'startup-complete',
            () => this.#openAppGrid(),
            this
        );
    }

    disable() {
        this._settings = null;
        Main.layoutManager.disconnectObject(this);
    }

    #openAppGrid() {
        const prev = this._settings.get_boolean('enable-animations');
        this._settings.set_boolean('enable-animations', false);

        Main.overview.showApps();

        this._settings.set_boolean('enable-animations', prev);
    }
}

