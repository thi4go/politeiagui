import get from "lodash/fp/get";
import CryptoJS from "crypto-js";

export const getProposalStatus = (proposalStatus) => get(proposalStatus, [
  "Invalid",
  "NotFound",
  "NotReviewed",
  "Censored",
  "Public",
]);

export const getHumanReadableError = (errorCode, errorContext) => get(errorCode, [
  "The operation returned an invalid status.",
  "The provided email address or password was invalid.",
  "The provided email address was malformed.",
  "The provided user activation token is invalid.",
  "The provided user activation token is expired.",
  "The provided proposal does not have a name.",
  "The provided proposal does not have a description.",
  "The requested proposal does not exist.",
  "The submitted proposal has too many markdown files.",
  "The submitted proposal has too many images.",
  "The submitted proposal markdown is too large.",
  "The submitted proposal has one or more images that are too large.",
  "The provided password was malformed.",
  "The requested comment does not exist.",
  "The provided proposal name was invalid.",
  "The SHA256 checksum for one of the files was incorrect.",
  "The Base64 encoding for one of the files was incorrect.",
  `The MIME type detected for ${errorContext[0]} did not match the provided MIME type. MIME type: ${errorContext[1]}`,
  "The MIME type for one of the files is not supported.",
  "The proposal cannot be set to that status."
]);

// Copied from https://stackoverflow.com/a/21797381
export const base64ToArrayBuffer = base64 => {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// Copied from https://stackoverflow.com/a/33918579
export const arrayBufferToWordArray = ab => {
  var i8a = new Uint8Array(ab);
  var a = [];
  for (var i = 0; i < i8a.length; i += 4) {
    // eslint-disable-next-line
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
}