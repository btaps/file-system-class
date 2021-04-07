// Create File System class
class FileSystem {
  constructor() {
    this.fileSystem = {};
    this.currentDirectory = "/";
  }

  pwd() {
    console.log(this.currentDirectory === "/" ? "/" : this.currentDirectory);
  }

  cd(path) {
    // check if path is using '..'
    let goUpCount = 0;
    path.split("/").forEach((dots) => {
      if (dots === "..") goUpCount++;
    });

    if (goUpCount) {
      if (this.currentDirectory === "/") return;

      let tempPath = this.currentDirectory.split("/");
      while (goUpCount !== 0) {
        tempPath.pop();
        goUpCount--;
      }

      if (tempPath.length === 1) this.currentDirectory = "/";
      else this.currentDirectory = tempPath.join("/");
      return;
    }

    // check for only characters [a-zA-Z]
    let letterCheck;

    path.split("/").forEach((directoryName) => {
      !directoryName.match("^[a-zA-Z]*$")
        ? (letterCheck = "Can't use characters outside [A-Z] [a-z]")
        : "";
    });
    if (letterCheck) {
      console.log(letterCheck);
      return;
    }
    //Check if path is valid
    if (path.split("/")[0] === "") {
      // Using absolute path
      let arr = path.split("/").filter((x) => x !== "");

      let directoryObjectFromRecursiveCheck = this.recursiveCheckOfPath(
        arr,
        0,
        this.fileSystem,
        "/"
      );
      // if path is valid
      if (directoryObjectFromRecursiveCheck.boolean) {
        this.currentDirectory =
          directoryObjectFromRecursiveCheck.directory.path;
      } else {
        // if path is false
        // find last valid directory
        let folder;
        arr.forEach((element, index) => {
          if (element === directoryObjectFromRecursiveCheck.lastTrueDirectory) {
            folder = arr[index + 1];
            return;
          }
        });
        if (!folder) folder = arr[0];
        console.log(`folder "${folder}" does not exist`);
      }
    } else {
      // Using relative path
      let currentPath;
      this.currentDirectory === "/"
        ? (currentPath = `${this.currentDirectory}${path}`)
        : (currentPath = `${this.currentDirectory}/${path}`);

      let arr = currentPath.split("/").filter((x) => x !== "");
      let directoryObjectFromRecursiveCheck = this.recursiveCheckOfPath(
        arr,
        0,
        this.fileSystem,
        "/"
      );
      if (directoryObjectFromRecursiveCheck.boolean) {
        this.currentDirectory =
          directoryObjectFromRecursiveCheck.directory.path;
      } else {
        let folder;
        arr.forEach((element, index) => {
          if (element === directoryObjectFromRecursiveCheck.lastTrueDirectory) {
            folder = arr[index + 1];
            return;
          }
        });
        if (!folder) folder = arr[0];
        console.log(`folder "${folder}" does not exist`);
      }
    }
  }

  mkdir(path) {
    // check if for characters [A-Z], [a-z]
    let letterCheck;
    path.split("/").forEach((directoryName) => {
      !directoryName.match("^[a-zA-Z]*$")
        ? (letterCheck = "Can't use characters outside [A-Z] [a-z]")
        : "";
    });
    if (letterCheck) {
      console.log(letterCheck);
      return;
    } // Using absolute path
    if (path.split("/")[0] === "") {
      let arr = path.split("/").filter((x) => x !== "");
      let tempArr = path.split("/").filter((x) => x !== "");
      arr.pop();

      let directoryObjectFromRecursiveCheck = this.recursiveCheckOfPath(
        arr,
        0,
        this.fileSystem,
        "/"
      );

      // If path is valid
      if (directoryObjectFromRecursiveCheck.boolean) {
        let copy = this.createFileSystemCopy({}, tempArr.join("/"));
        this.fileSystem = this.merge(this.fileSystem, copy);
      } else {
        // if path is false
        let folder;
        tempArr.forEach((element, index) => {
          if (element === directoryObjectFromRecursiveCheck.lastTrueDirectory) {
            folder = tempArr[index + 1];
            return;
          }
        });
        if (!folder) folder = arr[0];
        console.log(`folder "${folder}" does not exist`);
      }
    } else {
      // Using Relative path
      let pathToUse;
      if (this.currentDirectory === "/")
        pathToUse = this.currentDirectory + path;
      else pathToUse = this.currentDirectory + "/" + path;

      let arr = pathToUse.split("/").filter((x) => x !== "");
      let tempArr = pathToUse.split("/").filter((x) => x !== "");
      arr.pop();

      let directoryObjectFromRecursiveCheck = this.recursiveCheckOfPath(
        arr,
        0,
        this.fileSystem,
        "/"
      );

      if (directoryObjectFromRecursiveCheck.boolean) {
        let copy = this.createFileSystemCopy({}, tempArr.join("/"));
        this.fileSystem = this.merge(this.fileSystem, copy);
      } else {
        let folder;
        tempArr.forEach((element, index) => {
          if (element === directoryObjectFromRecursiveCheck.lastTrueDirectory) {
            folder = tempArr[index + 1];
            return;
          }
        });
        if (!folder) folder = arr[0];
        console.log(`folder "${folder}" does not exist`);
      }
    }
  }

  rmdir(path) {
    // check if path is using '..'
    let goUpCount = 0;
    let tempPath;
    path.split("/").forEach((dots) => {
      if (dots === "..") goUpCount++;
    });

    if (goUpCount) {
      tempPath = this.currentDirectory.split("/").filter((x) => x !== "");
      while (goUpCount !== 0) {
        tempPath.pop();
        goUpCount--;
      }
    }

    // check for only characters [a-zA-Z]
    let letterCheck;

    path.split("/").forEach((directoryName) => {
      !directoryName.match("^[a-zA-Z.]*$")
        ? (letterCheck = "Can't use characters outside [A-Z] [a-z]")
        : "";
    });
    if (letterCheck) {
      console.log(letterCheck);
      return;
    }

    // Finalize path to use
    let pathToUse = this.currentDirectory.split("/");
    //let tempPath2;

    // If path had ".." (dots) in it
    if (tempPath) pathToUse = tempPath;
    // If absolute path
    else if (path.split("/")[0] === "")
      pathToUse = path.split("/").filter((x) => x !== "");
    // If current path is at root
    else if (this.currentDirectory === "/") pathToUse = pathToUse;
    // If path is relative
    else {
      pathToUse = this.currentDirectory + "/" + path;
      pathToUse = pathToUse.split("/").filter((x) => x !== "");
    } //console.log(this.fileSystem);
    let answerToRmdirFunction = this.removeDirectoryUsingPath(
      this.fileSystem,
      pathToUse
    );

    if (answerToRmdirFunction)
      console.log(`Directory ${pathToUse.pop()} deleted successfully`);
    else {
      let tempDirectory = pathToUse.pop();
      if (tempDirectory === undefined) {
        console.log(
          "Root directory was whiped. Working on a clean root directory now."
        );
        this.fileSystem = {};
      } else console.log(`Directory ${tempDirectory} does not exist`);
    }
    console.log(this.fileSystem);
  }

  // Helper functions
  removeDirectoryUsingPath(obj, path) {
    //console.log(path);
    for (let i = 0; i < path.length; i++) {
      let directory = path[i];
      if (obj[directory] === undefined) return false;
      else if (obj[directory].name === path[path.length - 1]) {
        delete obj[directory];
        return true;
      }
      obj = obj[directory];
    }
  }

  createFileSystemCopy(obj, path) {
    path = path.split("/");

    let cur = obj;
    let currentPath;
    path.forEach((directory) => {
      if (!currentPath) currentPath = "/" + directory;
      else currentPath = currentPath + "/" + directory;
      cur[directory] = {name: directory, path: currentPath};
      cur = cur[directory];
    });

    return obj;
  }

  merge(...properties) {
    let target = {};
    let merger = (obj) => {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (Object.prototype.toString.call(obj[prop]) === "[object Object]") {
            target[prop] = this.merge(target[prop], obj[prop]);
          } else {
            target[prop] = obj[prop];
          }
        }
      }
    };
    for (let i = 0; i < properties.length; i++) {
      merger(properties[i]);
    }
    return target;
  }

  recursiveCheckOfPath(arr, index, fs, lastTrueDirectory) {
    let directory = arr[index];
    if (!directory) return {boolean: true, directory: fs};
    if (!fs[directory])
      return {boolean: false, lastTrueDirectory: lastTrueDirectory};

    lastTrueDirectory = directory;
    let currentObject = fs[directory];
    return this.recursiveCheckOfPath(
      arr,
      index + 1,
      currentObject,
      lastTrueDirectory
    );
  }
}

let file = new FileSystem();

// Additional class/function can be added
file.sayHello = () => console.log("hello");
file.sayHello(); //'hello'

file.newClass = new (class {
  sayHi() {
    console.log("I'm a new class");
  }
})();
file.newClass.sayHi(); // "I'm a new class"

file.mkdir("usr");
file.cd("usr");
file.mkdir("local");
file.cd("local");
file.pwd(); // usr/local

file.cd("..");
file.mkdir("share");
file.mkdir("share/info");
file.cd("share/info");
file.pwd(); // /usr/share/info

file.mkdir("/usr/local/log");
file.cd("/usr/local/log");
file.pwd(); // /usr/local/log

file.mkdir("some/folder"); // folder "some" does not exist

file.cd("/usr/unkown/folder"); // folder "unknown" does not exis
