#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // macOS：隐藏 Dock 图标，应用仅驻留系统托盘
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            build_tray(app.handle())?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                // 关闭主窗口 = 收起到托盘，不退出进程。
                // 退出请走托盘菜单的「退出 JTool」。
                // 注意：hide() 之后窗口会从任务栏消失，所以必须提供托盘菜单里的「显示主窗口」，
                // 否则用户既退不掉、也找不回窗口（此前的 bug）。
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running JTool");
}

/// 创建系统托盘图标与菜单。
///
/// 此前托盘图标是靠 tauri.conf.json 的 `app.trayIcon` 自动创建的，没有任何菜单，
/// 于是窗口一关（只是 hide）就既没有退出入口、也没有找回窗口的办法 —— 只能开任务管理器杀进程。
/// 现在改为在 Rust 侧完整创建，并提供「显示主窗口 / 退出 JTool」两项。
fn build_tray(app: &tauri::AppHandle) -> tauri::Result<()> {
    use tauri::menu::{Menu, MenuItem};
    use tauri::tray::{TrayIconBuilder, TrayIconEvent};

    let show_item = MenuItem::with_id(app, "show", "显示主窗口", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", "退出 JTool", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

    let builder = TrayIconBuilder::with_id("main-tray")
        .menu(&menu)
        .tooltip("JTool - 开发者工具集")
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => app.exit(0),
            "show" => show_main_window(app),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            // 用 `{ .. }` 而不是绑定具体字段：TrayIconEvent 的字段在不同 Tauri 2.x
            // 小版本之间变动过（x/y → id/position/rect），写死字段名会编译失败。
            if let TrayIconEvent::DoubleClick { .. } = event {
                show_main_window(tray.app_handle());
            }
        });

    // 图标取 bundle 里配置的那个；万一取不到也不阻断启动。
    let builder = match app.default_window_icon().cloned() {
        Some(icon) => builder.icon(icon),
        None => builder,
    };

    builder.build(app)?;
    Ok(())
}

/// 显示主窗口、取消最小化并置顶。
fn show_main_window(app: &tauri::AppHandle) {
    use tauri::Manager;

    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}
