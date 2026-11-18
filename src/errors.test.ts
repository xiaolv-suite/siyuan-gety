import assert from 'node:assert/strict';
import { describeKernelError } from './index.ts';

Deno.test('describeKernelError explains sandbox network denial', () => {
	const message = describeKernelError(
		'http://localhost:6806',
		'tok',
		new Error(
			'permission denied: net access to "localhost:6806" is not granted by the connector\'s manifest',
		),
	);
	assert.match(message, /未授权访问思源地址 http:\/\/localhost:6806/);
	assert.match(message, /思源 API 地址/);
});

Deno.test('describeKernelError explains getaddrinfo EPERM as a grant problem', () => {
	const message = describeKernelError(
		'http://127.0.0.1:6806',
		'tok',
		new Error('getaddrinfo EPERM 127.0.0.1'),
	);
	assert.match(message, /未授权访问思源地址/);
});

Deno.test("describeKernelError explains Deno's own sandbox wording", () => {
	// Exact text observed from a Deno run without the granted host, and the
	// wording Gety's host runner surfaces. It contains no "permission denied"
	// and no EPERM, which is why the matcher must cover it explicitly.
	const message = describeKernelError(
		'http://localhost:6806',
		'tok',
		new Error(
			'Network error calling /api/system/version: Requires net access to "localhost:6806", run again with the --allow-net flag',
		),
	);
	assert.match(message, /未授权访问思源地址/);
});

Deno.test('describeKernelError explains a rejected token', () => {
	const message = describeKernelError(
		'http://localhost:6806',
		'tok',
		new Error('HTTP 401 from /api/notebook/lsNotebooks: Auth failed'),
	);
	assert.match(message, /令牌被拒绝/);
	assert.equal(message.includes('未授权访问'), false);
});

Deno.test('describeKernelError keeps an unreachable kernel generic', () => {
	const message = describeKernelError(
		'http://localhost:6806',
		'tok',
		new Error('Network error calling /api/system/version: connection refused'),
	);
	assert.match(message, /无法连接思源内核/);
	assert.equal(message.includes('未授权访问'), false);
});
