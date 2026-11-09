# Sakura Stream 🌸

**Version 1.6.3** · Created by [~Mizu~No~Kami~](https://shikimori.io/~Mizu~No~Kami~)

[English](#english) · [Русский](#русский) · [日本語](#日本語)

## English

Sakura Stream is a browser extension for listening to internet radio in a customizable player. Playback continues when you close the popup, so you can listen while browsing.

### Features

- Listen to included stations, or add, edit, and remove your own using a stream URL. Restore the default stations from settings.
- Control playback and volume, mute audio, and open a separate player window.
- See the current track when the station provides supported metadata, copy its title, and view or clear track history.
- Set a sleep timer to stop playback automatically.
- Choose a theme or set custom background and accent colors. Add an image or animated GIF as the background from a URL or your device, and choose effects such as petals, stars, or rain.
- Hide the interface to enjoy the background; restore it with the on-screen button or Escape.
- Use the interface in English, Russian, or Japanese. Settings and stations are saved locally in the browser.

### Installation

1. Use Chrome 116 or later, or a compatible Chromium-based browser with Manifest V3 and offscreen document support.
2. Download or clone this repository and keep its files together in a folder.
3. Open `chrome://extensions`, enable **Developer mode**, and select **Load unpacked**.
4. Select the extension folder, then open Sakura Stream from the browser's extensions menu. Pin it for quick access if you wish.

### Getting started

Select a station and press its play button. To add one, choose **Add station**, enter its name and direct stream URL, and optionally provide an image URL and a program or track metadata URL. Save the station; its edit and delete controls are available in the station list. Stream formats and metadata availability depend on the station and browser.

Open **Appearance and settings** to customize the player, change the language, view history, or restore defaults. To use an online image or GIF, right-click it in your browser, choose **Copy image address**, and paste the direct image URL into the background field. A direct image URL does not need a file extension; a link to a webpage will not work. Alternatively, choose an image from your device. Use × to remove the current background.

### Permissions

The extension uses storage for settings, stations, and history; an offscreen document for background audio; alarms for the sleep timer; clipboard access for copying track titles; and network access to station streams, metadata, and images. It also uses declarative network request rules for compatible network requests.

## Русский

Sakura Stream — расширение для прослушивания интернет-радио с настраиваемым плеером. Воспроизведение продолжается после закрытия окна расширения, поэтому музыку можно слушать во время работы в браузере.

### Возможности

- Слушайте готовые радиостанции или добавляйте, редактируйте и удаляйте свои по ссылке на поток. Стандартные станции можно восстановить в настройках.
- Управляйте воспроизведением и громкостью, отключайте звук и открывайте плеер в отдельном окне.
- Просматривайте название текущего трека, если станция предоставляет поддерживаемые данные; копируйте название, просматривайте и очищайте историю треков.
- Установите таймер сна для автоматической остановки воспроизведения.
- Выберите тему или задайте свои цвета фона и акцента. Добавьте фоновое изображение или анимированный GIF по ссылке либо с устройства и выберите эффекты, например лепестки, звёзды или дождь.
- Скрывайте интерфейс, чтобы посмотреть на фон, и возвращайте его кнопкой на экране или клавишей Escape.
- Используйте интерфейс на русском, английском или японском языке. Настройки и станции сохраняются локально в браузере.

### Установка

1. Используйте Chrome версии 116 или новее либо совместимый браузер на Chromium с поддержкой Manifest V3 и внеэкранных документов.
2. Скачайте или клонируйте репозиторий, сохранив все файлы в одной папке.
3. Откройте `chrome://extensions`, включите **Режим разработчика** и нажмите **Загрузить распакованное расширение**.
4. Выберите папку расширения и откройте Sakura Stream из меню расширений браузера. При желании закрепите его для быстрого доступа.

### Начало работы

Выберите станцию и нажмите кнопку воспроизведения. Чтобы добавить свою, нажмите **Добавить станцию**, укажите название и прямую ссылку на поток, а также при желании ссылку на изображение и адрес программы или данных о треке. Сохраните станцию; её можно редактировать и удалять в списке. Поддержка форматов потока и наличие данных о треке зависят от станции и браузера.

Откройте **Оформление и настройки**, чтобы изменить внешний вид и язык, посмотреть историю или восстановить настройки по умолчанию. Чтобы установить изображение или GIF из интернета, нажмите на него правой кнопкой мыши, выберите **Копировать адрес изображения** и вставьте прямую ссылку в поле фона. Расширение файла в прямой ссылке необязательно; ссылка на веб-страницу не подойдёт. Также можно выбрать изображение с устройства. Кнопка × удаляет текущий фон.

### Разрешения

Расширение использует хранилище для настроек, станций и истории; внеэкранный документ для фонового воспроизведения; будильники для таймера сна; буфер обмена для копирования названий треков; сетевой доступ для потоков, данных станций и изображений. Правила declarative network request используются для совместимости сетевых запросов.

## 日本語

Sakura Stream は、インターネットラジオを好みの見た目のプレーヤーで聴けるブラウザー拡張機能です。ポップアップを閉じた後も再生が続くため、ブラウジング中に音楽を楽しめます。

### 主な機能

- 登録済みの放送局を聴いたり、ストリーム URL を使って放送局を追加・編集・削除したりできます。設定から初期放送局を復元できます。
- 再生と音量の操作、ミュート、別ウィンドウでのプレーヤー表示に対応しています。
- 放送局が対応する情報を提供している場合は再生中の曲名を表示し、曲名のコピーや再生履歴の確認・消去ができます。
- スリープタイマーで再生を自動停止できます。
- テーマを選択するか、背景色とアクセント色を設定できます。URL または端末から画像やアニメーション GIF を背景に追加し、花びら・星・雨などのエフェクトを選べます。
- インターフェースを隠して背景を表示し、画面上のボタンまたは Escape キーで元に戻せます。
- 日本語・英語・ロシア語に対応しています。設定と放送局はブラウザー内に保存されます。

### インストール

1. Chrome 116 以降、または Manifest V3 とオフスクリーンドキュメントに対応する Chromium 系ブラウザーを使用します。
2. このリポジトリをダウンロードまたはクローンし、ファイルを同じフォルダーに保存します。
3. `chrome://extensions` を開き、**デベロッパー モード**を有効にして、**パッケージ化されていない拡張機能を読み込む**を選びます。
4. 拡張機能のフォルダーを選び、ブラウザーの拡張機能メニューから Sakura Stream を開きます。必要に応じてピン留めしてください。

### 使い方

放送局を選び、再生ボタンを押します。放送局を追加するには、**放送局を追加**を選び、名前とストリームの直接 URL を入力します。画像 URL と番組・曲情報 URL も任意で設定できます。保存後は一覧から編集・削除できます。ストリーム形式への対応や曲情報の有無は、放送局とブラウザーによって異なります。

**表示と設定**から、外観や言語の変更、履歴の確認、初期設定の復元ができます。インターネット上の画像や GIF を背景にするには、画像を右クリックして**画像アドレスをコピー**し、画像への直接 URL を背景欄に貼り付けます。直接 URL に拡張子は必須ではありません。ウェブページへのリンクは使えません。端末から画像を選ぶこともできます。× ボタンで現在の背景を削除できます。

### 権限

設定・放送局・履歴の保存にストレージ、バックグラウンド再生にオフスクリーンドキュメント、スリープタイマーにアラーム、曲名のコピーにクリップボード、ストリーム・放送局情報・画像の取得にネットワークアクセスを使用します。また、ネットワークリクエストの互換性のために declarative network request ルールを使用します。
