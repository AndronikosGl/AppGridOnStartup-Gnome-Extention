const Gio = imports.gi.Gio;
const Main = imports.ui.main;

let signalId = null;
const settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });

function enable() {
    // If GNOME is already running, do nothing
    if (!Main.layoutManager._startingUp) return;

    // Connect to startup-complete signal
    signalId = Main.layoutManager.connect('startup-complete', () => {
        Main.layoutManager.disconnect(signalId);
        signalId = null;
        _openAppGrid();
    });
}

function disable() {
    if (signalId) {
        Main.layoutManager.disconnect(signalId);
        signalId = null;
    }
}

function _openAppGrid() {
    const prev = settings.get_boolean('enable-animations');
    settings.set_boolean('enable-animations', false);

    Main.overview.showApps();

    settings.set_boolean('enable-animations', prev);
}

// Export the functions for GNOME Shell
var extension = {
    enable: enable,
    disable: disable
};

