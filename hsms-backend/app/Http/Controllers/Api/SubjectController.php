<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Subject::all()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:subjects,name'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subject = Subject::create($request->all());

        return response()->json([
            'message'=>'Subject created successfully',
            'data'=>$subject
        ], 201);
    }

    public function show($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message'=>'Subject not found'], 404);
        }

        return response()->json($subject);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message'=>'Subject not found'], 404);
        }

        $subject->update($request->only('name'));

        return response()->json([
            'message'=>'Subject updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message'=>'Subject not found'], 404);
        }

        $subject->delete();

        return response()->json([
            'message'=>'Subject deleted successfully'
        ]);
    }
}
