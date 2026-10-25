{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    git-hooks.url = "github:cachix/git-hooks.nix";
    git-hooks.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = {
    self,
    nixpkgs,
    git-hooks,
  }: let
    forAllSystems = f:
      nixpkgs.lib.genAttrs
      ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"]
      (system: f nixpkgs.legacyPackages.${system});
  in {
    checks = forAllSystems (pkgs: {
      pre-commit = git-hooks.lib.${pkgs.system}.run {
        src = ./.;
        hooks = {
          alejandra.enable = true;
        };
      };
    });

    packages = forAllSystems (pkgs: {
      image = pkgs.dockerTools.buildLayeredImage {
        name = "git.xhos.dev/xhos/xhos.dev";
        tag = "${self.lastModifiedDate}-${self.shortRev or "dirty"}";
        config = {
          Cmd = [
            "${pkgs.static-web-server}/bin/static-web-server"
            "--port"
            "8080"
            "--root"
            "${./www}"
            "--page404"
            "${./www}/404.html"
          ];
          ExposedPorts."8080/tcp" = {};
        };
      };
    });

    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          python3
          (writeShellScriptBin "run" ''
            python3 -m http.server -d www
          '')
        ];
        shellHook = "${self.checks.${pkgs.system}.pre-commit.shellHook}";
      };
    });
  };
}
