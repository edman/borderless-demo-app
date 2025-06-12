/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function id(id) {
  return document.getElementById(id);
}

function onPermissionChanged({ state }) {
  id("permission-state").innerText = state;
  id("permission-prompt").disabled = state !== "prompt";
}

document.addEventListener("DOMContentLoaded", () => {
  id("permission-prompt").addEventListener("click", () =>
    window.getScreenDetails(),
  );

  navigator.permissions.query({ name: "window-management" }).then((status) => {
    id("loading").classList.add("hidden");
    onPermissionChanged(status);
    status.onchange = () => onPermissionChanged(status);
  });
});
