export function setFullscreen(): void {
  const element = document.body as HTMLElement;
  const methodToBeInvoked = element.requestFullscreen;
  if (methodToBeInvoked) {
    methodToBeInvoked.call(element);
  }
}

// export function exitFullscreen(): void {
//   const element = document.body as HTMLElement;
//   const methodToBeInvoked = element.exitFullscreen();
//   if (methodToBeInvoked) {
//     methodToBeInvoked.call(element);
//   }
// }

export function setPointerLock(): void {
  const element = document.body as HTMLElement;
  const methodToBeInvoked = element.requestPointerLock;
  if (methodToBeInvoked) {
    methodToBeInvoked.call(element);
  }
}
