/* Search metadata: author-reviewed task aliases and intent phrases. */
window.SEARCH_TERMS = {
  "t01": "rename computer device macbook mac name hostname",
  "t02": "startup login auto open apps turn off background launch",
  "t03": "send share airdrop nearby device file transfer",
  "t04": "appearance light dark accent personalisation personalize",
  "t05": "control centre quick settings bluetooth wifi screen mirror",
  "t06": "dock size enlarge icons zoom magnify",
  "t07": "hide dock remove taskbar screen space",
  "t08": "default browser chrome open link safari",
  "t09": "hotspot internet tether phone wifi off campus only",
  "t10": "fingerprint touch id unlock login",
  "t11": "right click secondary click two finger trackpad",
  "t12": "stacks organise organize tidy desktop files",
  "t13": "stage manager focus windows",
  "t14": "mission control spaces virtual desktops switch",
  "t15": "favorites favourites pin frequent files finder",
  "t16": "spotlight find app calculator search files quickly",
  "t17": "command tab switch apps multitask window",
  "t18": "quit force close app switcher",
  "t19": "do not disturb mute alerts focus notification silence",
  "t20": "emoji smiley character symbols picker",
  "t21": "quick look preview file space",
  "t22": "screenshot screen shot capture record video screen recording screen recorder",
  "t23": "focused inbox organise organize mail sort email",
  "t24": "schedule send delay email later postpone outlook",
  "t25": "undo send unsend recall email delay send",
  "t26": "create folder outlook organise email",
  "t27": "rules automatic move filter emails",
  "t28": "snooze email remind later postpone mail",
  "t29": "convert email calendar create appointment",
  "t30": "pin important message email",
  "t31": "flag todo follow up task email",
  "t32": "my day side panel calendar while reading email",
  "t33": "unsubscribe newsletter marketing mailing list",
  "t34": "share calendar access colleague",
  "t35": "open shared calendar colleague",
  "t36": "calendar day week month view outlook",
  "t37": "meeting scheduling assistant find free time attendees",
  "t38": "calendar work week view teams",
  "t39": "schedule teams online meeting video call appointment",
  "t40": "favourite favorite teams channels pin sidebar",
  "t41": "mute teams messages alerts disable notifications notifications banners popups silence quiet focus",
  "t42": "mute teams chat messages silence conversation favourites",
  "t43": "unread mentions alerts messages teams chat",
  "t44": "channel notifications mute teams channel messages",
  "t45": "find search open tabs browser chrome",
  "t46": "find browser history bookmarks search",
  "t47": "keyboard shortcuts focus address bar open tab find",
  "t48": "tab groups organize organise tabs by projects",
  "t49": "pin chrome tabs keep website page open",
  "t50": "bookmark save a website webpage favourite chrome",
  "t51": "reopen restore closed chrome tab undo close reopen tab",
  "b01": "tile split screen arrange two windows side by side compare windows mac",
  "b02": "capture partial area screenshot shot selection crop screen",
  "b03": "restore reopen session past browser tabs history",
  "b04": "availability status busy away do not disturb teams"
};
window.SEARCH_INTENTS = [
  {
    "regex": "\\b(?:turn off|disable|stop|silence|quiet|mute)\\b.*\\bteams\\b.*\\b(?:notifications?|alerts?|popups?|banners?|messages?)\\b|\\bteams\\b.*\\b(?:notifications?|alerts?)\\b",
    "ids": [
      "t41",
      "t44",
      "t42"
    ]
  },
  {
    "regex": "\\b(?:reopen|restore|undo)\\b.*\\b(?:closed|close|lost)\\b.*\\btab\\b|\\bundo close tab\\b",
    "ids": [
      "t51",
      "b03"
    ]
  },
  {
    "regex": "\\b(?:split|side by side|two windows|tile windows)\\b",
    "ids": [
      "b01",
      "t13"
    ]
  },
  {
    "regex": "\\b(?:record|capture|film|video|screenshot)\\b.*\\bscreen\\b|\\bscreen\\b.*\\b(?:record|capture|video)\\b",
    "ids": [
      "t22",
      "b02"
    ]
  },
  {
    "regex": "\\b(?:save|bookmark)\\b.*\\b(?:website|webpage|page|site)\\b",
    "ids": [
      "t50",
      "t49"
    ]
  },
  {
    "regex": "\\b(?:stage manager)\\b",
    "ids": [
      "t13",
      "b01"
    ]
  },
  {
    "regex": "\\b(?:spotlight|find (?:a |my )?file)\\b",
    "ids": [
      "t16",
      "t21"
    ]
  },
  {
    "regex": "\\b(?:do not disturb|focus mode|quiet mode)\\b",
    "ids": [
      "t19",
      "t41"
    ]
  },
  {
    "regex": "\\b(?:schedule|send later)\\b.*\\b(?:email|mail|message)\\b",
    "ids": [
      "t24",
      "t25"
    ]
  },
  {
    "regex": "\\b(?:snooze|remind later)\\b.*\\b(?:email|mail|message)\\b",
    "ids": [
      "t28",
      "t31"
    ]
  }
];
