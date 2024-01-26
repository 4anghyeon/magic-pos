/* eslint-disable */

importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

/* eslint-enable */

firebase.initializeApp({
  apiKey: 'AIzaSyCHk7ehe1E_bNsvRrhuxWLzGpCHFr8upQc',
  authDomain: 'sparta-1e500.firebaseapp.com',
  projectId: 'sparta-1e500',
  storageBucket: 'sparta-1e500.appspot.com',
  messagingSenderId: '1083040765098',
  appId: '1:1083040765098:web:cb44b1bf87199dc9bbecd3',
});

const messaging = firebase.messaging();
console.log('messaging: ', messaging);

// 푸시 이벤트 처리
// 푸시 내용을 처리해서 알림으로 띄운다.
self.addEventListener('push', function (event) {
  if (event.data) {
    // 알림 메세지일 경우엔 event.data.json().notification;
    const data = event.data.json().data;
    const options = {
      body: data.body,
      icon: data.image,
      image: data.image,
      data: {
        click_action: data.click_action, // 이 필드는 밑의 클릭 이벤트 처리에 사용됨
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    console.log('This push event has no data.');
  }
});

// 클릭 이벤트 처리
// 알림을 클릭하면 사이트로 이동한다.
self.addEventListener('notificationclick', function (event) {
  event.preventDefault();
  // 알림창 닫기
  event.notification.close();

  // 이동할 url
  // 아래의 event.notification.data는 위의 푸시 이벤트를 한 번 거쳐서 전달 받은 options.data에 해당한다.
  // api에 직접 전달한 데이터와 혼동 주의
  const urlToOpen = event.notification.data.click_action;

  // 클라이언트에 해당 사이트가 열려있는지 체크
  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then(function (windowClients) {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url.includes(urlToOpen)) {
          matchingClient = windowClient;
          break;
        }
      }

      // 열려있다면 focus, 아니면 새로 open
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});
