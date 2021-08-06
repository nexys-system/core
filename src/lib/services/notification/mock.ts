import * as T from "./type";

export const nsIn: T.Out[] = [
  {
    uuid: "514b4dec-9ddc-11ea-90f0-42010aac0019",
    type: { id: 1, name: "t" },
    isValidationRequired: false,
    cms: {
      uuid: "c1",
      isHtml: true,
      title: "<h1>First Notification</h1>",
      content:
        "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque luctus dictum placerat. Sed commodo velit sed dapibus efficitur. Proin eu commodo lacus, at auctor leo. Maecenas hendrerit blandit condimentum. Ut eu rutrum neque, sed mattis eros. In gravida nulla id vestibulum varius. Etiam tempus velit ante, mollis dignissim lectus vulputate in. Donec eu mauris a dolor condimentum laoreet. Integer pellentesque bibendum diam sit amet ullamcorper.</p><p>Mauris ut dui vitae dolor aliquet blandit. Mauris porta, diam nec commodo maximus, mauris lorem finibus ligula, eu aliquet velit neque vitae mi. Nulla nulla lacus, euismod sed rhoncus eu, convallis sit amet mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut convallis dapibus gravida. Nullam tincidunt porttitor justo, dignissim lobortis elit consectetur et. In consequat turpis nunc, ac vehicula lorem viverra non. Nam porta ipsum ut leo euismod, ac egestas lorem egestas. Curabitur non enim venenatis, ultrices arcu vel, ultrices metus. Aliquam in nulla et est varius suscipit a quis nisl.</p><p>Vestibulum at quam turpis. Fusce id tincidunt tellus. Pellentesque ultrices, justo quis pharetra congue, ipsum nisl pellentesque neque, ut dictum ex arcu non ex. Maecenas nec posuere orci. Phasellus justo nunc, congue id massa eu, elementum rhoncus dolor. Sed a tincidunt mi. Fusce interdum convallis leo mollis malesuada. Donec porttitor iaculis elit, vitae finibus massa pharetra quis.</p>",
    },
  },
  {
    uuid: "514b4dec-9ddc-11ea-90f0-42010aac0011",
    type: { id: 1, name: "t" },
    isValidationRequired: true,
    cms: {
      uuid: "c2",
      isHtml: true,
      title: "<h1>Second Notification - It might have a longer title</h1>",
      content:
        "<p>Present faucibus molestie justo, accumsan iaculis tellus viverra sed. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a viverra mi. Vivamus dignissim in magna et tempor. Cras interdum purus non lacus viverra mattis. Quisque quis sem eget ante convallis lobortis. Morbi pharetra vitae sapien id ullamcorper. In ultricies lorem vel arcu aliquet scelerisque. Ut at diam ut nunc malesuada rutrum. Aenean egestas lacinia nunc, non sagittis enim tristique nec. Donec sit amet augue quis urna luctus vehicula. Pellentesque sollicitudin suscipit nisl, at fringilla felis feugiat a. Suspendisse aliquet velit at eros tincidunt, a condimentum felis faucibus. Cras scelerisque sem tempor nibh venenatis scelerisque.</p><ul><li>First thing</li><li>Second things</li><li>Third thing</li></ul>",
    },
  },
];

export const nsOut: T.OutPublic[] = [
  {
    uuid: "514b4dec-9ddc-11ea-90f0-42010aac0019",
    title: "<h1>First Notification</h1>",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque luctus dictum placerat. Sed commodo velit sed dapibus efficitur. Proin eu commodo lacus, at auctor leo. Maecenas hendrerit blandit condimentum. Ut eu rutrum neque, sed mattis eros. In gravida nulla id vestibulum varius. Etiam tempus velit ante, mollis dignissim lectus vulputate in. Donec eu mauris a dolor condimentum laoreet. Integer pellentesque bibendum diam sit amet ullamcorper.</p><p>Mauris ut dui vitae dolor aliquet blandit. Mauris porta, diam nec commodo maximus, mauris lorem finibus ligula, eu aliquet velit neque vitae mi. Nulla nulla lacus, euismod sed rhoncus eu, convallis sit amet mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut convallis dapibus gravida. Nullam tincidunt porttitor justo, dignissim lobortis elit consectetur et. In consequat turpis nunc, ac vehicula lorem viverra non. Nam porta ipsum ut leo euismod, ac egestas lorem egestas. Curabitur non enim venenatis, ultrices arcu vel, ultrices metus. Aliquam in nulla et est varius suscipit a quis nisl.</p><p>Vestibulum at quam turpis. Fusce id tincidunt tellus. Pellentesque ultrices, justo quis pharetra congue, ipsum nisl pellentesque neque, ut dictum ex arcu non ex. Maecenas nec posuere orci. Phasellus justo nunc, congue id massa eu, elementum rhoncus dolor. Sed a tincidunt mi. Fusce interdum convallis leo mollis malesuada. Donec porttitor iaculis elit, vitae finibus massa pharetra quis.</p>",
    isValidationRequired: false,
  },
  {
    uuid: "514b4dec-9ddc-11ea-90f0-42010aac0011",
    title: "<h1>Second Notification - It might have a longer title</h1>",
    content:
      "<p>Present faucibus molestie justo, accumsan iaculis tellus viverra sed. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a viverra mi. Vivamus dignissim in magna et tempor. Cras interdum purus non lacus viverra mattis. Quisque quis sem eget ante convallis lobortis. Morbi pharetra vitae sapien id ullamcorper. In ultricies lorem vel arcu aliquet scelerisque. Ut at diam ut nunc malesuada rutrum. Aenean egestas lacinia nunc, non sagittis enim tristique nec. Donec sit amet augue quis urna luctus vehicula. Pellentesque sollicitudin suscipit nisl, at fringilla felis feugiat a. Suspendisse aliquet velit at eros tincidunt, a condimentum felis faucibus. Cras scelerisque sem tempor nibh venenatis scelerisque.</p><ul><li>First thing</li><li>Second things</li><li>Third thing</li></ul>",
    isValidationRequired: true,
  },
];

export const out2: T.Out[] = [
  {
    uuid: "uuid1",
    type: { id: 1, name: "banner" },
    isValidationRequired: false,
    cms: {
      uuid: "cmsuuid1",
      title: "this has to be redone once endpoint works 1",
      content: "content1",
      isHtml: false,
    },
  },
  {
    uuid: "uuid2",
    type: { id: 1, name: "banner" },
    isValidationRequired: true,
    cms: {
      uuid: "cmsuuid2",
      title: "this has to be redone once endpoint works 2",
      content: "content2",
      isHtml: false,
    },
  },
];
