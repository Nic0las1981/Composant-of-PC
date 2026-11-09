"""Publish a compiled site to gh-pages, preserving source checkout and history.

Repository GitHub Pages must use the gh-pages branch with the / (root) folder.
Authentication uses the configured Git remote; no credentials are read here.
"""
from pathlib import Path
import os
import subprocess
import tempfile

repo = Path(__file__).resolve().parents[1]
dist = repo / 'dist'
if not (dist / 'index.html').is_file():
    raise SystemExit('Build missing: run npm run build.')

def git(*args, env=None):
    return subprocess.check_output(['git', *args], cwd=repo, env=env, text=True).strip()

remote = subprocess.run(['git', 'ls-remote', '--exit-code', 'origin', 'refs/heads/gh-pages'], cwd=repo, capture_output=True, text=True)
if remote.returncode not in (0, 2):
    raise SystemExit('Unable to check the deployment branch. No publication attempted.')
parent = None
if remote.returncode == 0:
    subprocess.run(['git', 'fetch', 'origin', 'refs/heads/gh-pages'], cwd=repo, check=True)
    parent = git('rev-parse', 'FETCH_HEAD')

with tempfile.TemporaryDirectory(prefix='forge-pages-') as staging:
    task_env = dict(os.environ, GIT_INDEX_FILE=str(Path(staging) / 'index'))
    subprocess.run(['git', 'read-tree', '--empty'], cwd=repo, env=task_env, check=True)
    subprocess.run(['git', f'--work-tree={dist}', 'add', '--all', '--force', '--', '.'], cwd=repo, env=task_env, check=True)
    tree = git('write-tree', env=task_env)
    files = git('ls-tree', '-r', '--name-only', tree).splitlines()
    assert 'index.html' in files and '.nojekyll' in files
    assert all(name in ('index.html', 'favicon.svg', '.nojekyll') or name.startswith('assets/') for name in files), 'Unexpected file in deployment.'
    if parent and tree == git('rev-parse', f'{parent}^{{tree}}'):
        print('Compiled site already matches the deployment branch. Nothing to publish.')
        raise SystemExit(0)
    args = ['commit-tree', tree, '-m', 'Publish FORGE compiled website']
    if parent:
        args.extend(['-p', parent])
    commit = git(*args, env=task_env)
    subprocess.run(['git', 'push', 'origin', f'{commit}:refs/heads/gh-pages'], cwd=repo, check=True)
    print('Compiled site sent to gh-pages. GitHub Pages activation and build status must be verified separately.')
