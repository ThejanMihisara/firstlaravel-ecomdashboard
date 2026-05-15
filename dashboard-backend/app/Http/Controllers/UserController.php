<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class UserController
{
    public function register(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $token = Str::random(60);

        $user = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'password' => Hash::make($req->password),
            'api_token' => $token,
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid email or password.'], 422);
        }

        $user = User::where('email', $req->email)->first();

        if (! $user || ! Hash::check($req->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password.'], 401);
        }

        $token = Str::random(60);
        $user->forceFill(['api_token' => $token])->save();

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $req)
    {
        if ($req->user()) {
            $req->user()->forceFill(['api_token' => null])->save();
            return response()->json(['message' => 'Logged out successfully']);
        }

        return response()->json(['message' => 'No user logged in'], 200);
    }
}
