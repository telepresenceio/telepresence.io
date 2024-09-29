import React from 'react';

import AppleIcon from '@site/src/assets/icons/apple.inline.svg';
import LinuxIcon from '@site/src/assets/icons/linux.inline.svg';
import WindowsIcon from '@site/src/assets/icons/windows.inline.svg';

// prettier-ignore
export class AbstractTab extends React.Component {
  render() {
    const msg = `Platform.${this.constructor.name} may only be used directly inside of Platform.TabGroup`;
    throw new Error(msg);
    // eslint-disable-next-line no-unreachable
    return <span>{msg}</span>;
  }

  // Order determines the order of the tabs in the tab bar, from left
  // to right.
  static get order(): number { throw new Error('unimplemented - must use a concrete class'); }

  // If the user's OS isn't in the tab group, the tab with the highest
  // priority is the default tab.
  static get priority(): number { throw new Error('unimplemented - must use a concrete class'); }

  // The slug is most visible as the "?os={slug}" URL query parameter,
  // but it is also used internally by the TabGroup.
  static get slug(): string { throw new Error('unimplemented - must use a concrete class'); }

  // How the tab should appear in the tab bar.
  static get icon() : React.ComponentType<React.SVGProps<SVGSVGElement>> { throw new Error('unimplemented - must use a concrete class'); }
  static get label() : string { throw new Error('unimplemented - must use a concrete class'); }
  static detect(_window : Window) : boolean { throw new Error('unimplemented - must use a concrete class'); }
}

// prettier-ignore
export class GNULinuxTab extends AbstractTab {
  static get order() { return 1; }
  static get priority() { return 3; }
  static get slug() { return 'gnu-linux'; }

  static get icon() { return LinuxIcon; }
  static get label() { return 'GNU/Linux'; }

  static detect(window : Window) {
    return /Linux/.test(window.navigator.platform);
  }
}

export class GNULinuxAMD64Tab extends AbstractTab {
  static get order() { return 1; }
  static get priority() { return 5; }
  static get slug() { return 'gnu-linux-amd64'; }

  static get icon() { return LinuxIcon; }
  static get label() { return 'GNU/Linux amd64'; }

  static detect(window : Window) {
    return /Linux/.test(window.navigator.platform);
  }
}

export class GNULinuxARM64Tab extends AbstractTab {
  static get order() { return 2; }
  static get priority() { return 4; }
  static get slug() { return 'gnu-linux-arm64'; }

  static get icon() { return LinuxIcon; }
  static get label() { return 'GNU/Linux arm64'; }

  static detect(window : Window) {
    return /Linux/.test(window.navigator.platform);
  }
}


// prettier-ignore
export class MacOSTab extends AbstractTab {
  static get order() { return 2; }
  static get priority() { return 2; }
  static get slug() { return 'macos'; }

  static get icon() { return AppleIcon; }
  static get label() { return 'macOS'; }

  static detect(window : Window) {
    return /Mac(intosh|Intel|PPC|68K)/.test(window.navigator.platform);
  }
}

export class MacOSAMD64Tab extends AbstractTab {
  static get order() { return 3; }
  static get priority() { return 3; }
  static get slug() { return 'macos-amd64'; }

  static get icon() { return AppleIcon; }
  static get label() { return 'macOS Intel (amd64)'; }

  static detect(window : Window) {
    return /Mac(intosh|Intel|PPC|68K)/.test(window.navigator.platform);
  }
}

export class MacOSARM64Tab extends AbstractTab {
  static get order() { return 4; }
  static get priority() { return 2; }
  static get slug() { return 'macos-arm64'; }

  static get icon() { return AppleIcon; }
  static get label() { return 'macOS M Series (arm64)'; }

  static detect(window : Window) {
    return /Mac(intosh|Intel|PPC|68K)/.test(window.navigator.platform);
  }
}

export class WindowsTabAMD64 extends AbstractTab {
  static get order() { return 5; }
  static get priority() { return 1; }
  static get slug() { return 'windows'; }

  static get icon() { return WindowsIcon; }
  static get label() { return 'Windows'; }

  static detect(window : Window) {
    return /Win(dows|32|64|CE)/.test(window.navigator.platform);
  }
}

// prettier-ignore
export class WindowsTab extends AbstractTab {
  static get order() { return 3; }
  static get priority() { return 1; }
  static get slug() { return 'windows'; }

  static get icon() { return WindowsIcon; }
  static get label() { return 'Windows'; }

  static detect(window : Window) {
    return /Win(dows|32|64|CE)/.test(window.navigator.platform);
  }
}

// prettier-ignore
export class UnknownTab extends AbstractTab {
  static get slug() { return 'unknown'; }
}
