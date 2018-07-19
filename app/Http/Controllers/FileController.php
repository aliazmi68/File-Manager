<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\File;
use Validator;
use DB;
use Auth;

class FileController extends Controller
{
    public function index(Request $request)
    {
        return ['files' => File::where('user_id', Auth::user()->id)->get()];
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->file(), [
            'file' => 'required|max:1000000',
        ]);

        if ($validator->fails()) {
            $errors = [];
            foreach ($validator->messages()->all() as $error) {
                array_push($errors, $error);
            }
            dd($errors);
            return response()->json(['errors' => $errors, 'status' => 400], 400);
        }

        $file = File::create([
            'user_id' => $request->user_id,
            'filename' => pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME),
            'type' => $request->file('file')->extension(),
            'size' => $request->file('file')->getClientSize()
        ]);

        $request->file('file')->move(__DIR__ . '/../../../public/file_uploads/', $file->id . '.' . $file->type);

        return response()->json(['errors' => [], 'files' => File::where('user_id', Auth::user()->id)->get(), 'status' => 200], 200);
    }

    public function destroy($id)
    {
        $file = base_path() .'/public/file_uploads/' . $id;

        if(is_file($file)){
            //  Deleting file from local storage
            unlink($file);

            //  Deleting record from Database
            File::find(explode(".",$id)[0])->delete();

            return response()->json(['errors' => [], 'files' => File::where('user_id', Auth::user()->id)->get(), 'status' => 200], 200);
        }
    }

    public function update(Request $request, $id)
    {

        $file = File::find($id);

        $file->filename = $request->filename;

        $file->save();

        return response()->json(['errors' => [], 'files' => File::where('user_id', Auth::user()->id)->get(), 'status' => 200], 200);

    }

    public function downloadFile(Request $request)
    {
        $file= base_path() .'/public/file_uploads/' . $request->input('id').'.'.$request->input('type');

        $headers = [
            'Content-Type' => 'application/pdf',
        ];

        return response()->download($file, $request->input('name'), $headers);
    }

}
